import Dexie from 'dexie';
import type { TransaksiData } from '../components/Transaksi/TransaksiForm';

class TelagaPakisajiDatabase extends Dexie {
  transactions: Dexie.Table<TransaksiData & { id?: number }, number>;
  accounts: Dexie.Table<{ name: string, id?: number }, number>;
  pendingSync: Dexie.Table<TransaksiData & { id?: number }, number>;

  constructor() {
    super('TelagaPakisajiDatabase');
    
    this.version(1).stores({
      transactions: '++id, tanggal, bulan, tahun, akun',
      accounts: '++id, name',
      pendingSync: '++id, tanggal, akun'
    });
    
    this.transactions = this.table('transactions');
    this.accounts = this.table('accounts');
    this.pendingSync = this.table('pendingSync');
  }
}

const db = new TelagaPakisajiDatabase();

class LocalStorageService {
  /**
   * Initialize the database with default accounts if empty
   */
  async initializeDefaultAccounts(): Promise<void> {
    const count = await db.accounts.count();
    
    if (count === 0) {
      // Add default accounts
      await db.accounts.bulkAdd([
        { name: 'Kas_Kantin' },
        { name: 'Kas_Sekolah' },
        { name: 'BCA' },
        { name: 'Lomba' },
        { name: 'Operasional' }
      ]);
    }
  }
  
  /**
   * Get all accounts
   */
  async getAccounts(): Promise<string[]> {
    const accounts = await db.accounts.toArray();
    return accounts.map(account => account.name);
  }
  
  /**
   * Add a new account
   */
  async addAccount(name: string): Promise<void> {
    await db.accounts.add({ name });
  }
  
  /**
   * Edit an account name
   */
  async editAccount(oldName: string, newName: string): Promise<void> {
    const account = await db.accounts.where('name').equals(oldName).first();
    if (account && account.id) {
      await db.accounts.update(account.id, { name: newName });
      
      // Update all transactions with this account
      await db.transactions.where('akun').equals(oldName).modify({ akun: newName });
      await db.pendingSync.where('akun').equals(oldName).modify({ akun: newName });
    }
  }
  
  /**
   * Delete an account
   */
  async deleteAccount(name: string): Promise<void> {
    await db.accounts.where('name').equals(name).delete();
  }
  
  /**
   * Add a transaction
   */
  async addTransaction(transaction: TransaksiData): Promise<number> {
    const id = await db.transactions.add(transaction);
    return id;
  }
  
  /**
   * Get all transactions
   */
  async getTransactions(): Promise<TransaksiData[]> {
    return await db.transactions.toArray();
  }
  
  /**
   * Delete a transaction
   */
  async deleteTransaction(id: number): Promise<void> {
    await db.transactions.delete(id);
  }
  
  /**
   * Add a transaction to pending sync queue
   */
  async addToPendingSync(transaction: TransaksiData): Promise<void> {
    await db.pendingSync.add(transaction);
  }
  
  /**
   * Get all pending sync transactions
   */
  async getPendingSync(): Promise<(TransaksiData & { id?: number })[]> {
    return await db.pendingSync.toArray();
  }
  
  /**
   * Remove a transaction from pending sync queue
   */
  async removeFromPendingSync(id: number): Promise<void> {
    await db.pendingSync.delete(id);
  }
  
  /**
   * Clear all pending sync transactions
   */
  async clearPendingSync(): Promise<void> {
    await db.pendingSync.clear();
  }
}

export default new LocalStorageService();