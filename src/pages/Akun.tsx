import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AkunManager from '../components/Akun/AkunManager';
import LocalStorageService from '../services/LocalStorageService';

const Akun = () => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Load accounts on component mount
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Initialize default accounts if needed
        await LocalStorageService.initializeDefaultAccounts();
        
        // Load accounts
        const accounts = await LocalStorageService.getAccounts();
        setAccounts(accounts);
      } catch (error) {
        console.error('Error loading accounts:', error);
        setError('Gagal memuat daftar akun. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAccounts();
  }, []);

  // Handle adding a new account
  const handleAddAccount = async (account: string) => {
    try {
      await LocalStorageService.addAccount(account);
      
      // Reload accounts
      const updatedAccounts = await LocalStorageService.getAccounts();
      setAccounts(updatedAccounts);
    } catch (error) {
      console.error('Error adding account:', error);
      setError('Gagal menambahkan akun. Silakan coba lagi.');
    }
  };

  // Handle editing an account
  const handleEditAccount = async (oldName: string, newName: string) => {
    try {
      await LocalStorageService.editAccount(oldName, newName);
      
      // Reload accounts
      const updatedAccounts = await LocalStorageService.getAccounts();
      setAccounts(updatedAccounts);
    } catch (error) {
      console.error('Error editing account:', error);
      setError('Gagal mengubah akun. Silakan coba lagi.');
    }
  };

  // Handle deleting an account
  const handleDeleteAccount = async (account: string) => {
    try {
      await LocalStorageService.deleteAccount(account);
      
      // Reload accounts
      const updatedAccounts = await LocalStorageService.getAccounts();
      setAccounts(updatedAccounts);
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Gagal menghapus akun. Silakan coba lagi.');
    }
  };

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
          Manajemen Akun
        </h1>
        <p className="text-gray-600">
          Kelola chart of account (COA) untuk pencatatan keuangan
        </p>
      </motion.div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="loading-spinner" />
          <span className="ml-3 text-gray-600">Memuat data...</span>
        </div>
      ) : (
        <AkunManager 
          accounts={accounts}
          onAddAccount={handleAddAccount}
          onEditAccount={handleEditAccount}
          onDeleteAccount={handleDeleteAccount}
        />
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-12 bg-gray-50 rounded-lg p-6 border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-primary mb-4">Tentang Chart of Account (COA)</h2>
        <p className="text-gray-600 mb-4">
          Chart of Account (COA) adalah daftar akun keuangan yang digunakan untuk mengkategorikan transaksi keuangan. 
          Dengan COA yang terstruktur, Anda dapat dengan mudah melacak arus kas, membuat laporan keuangan, 
          dan menganalisis kinerja keuangan.
        </p>
        <p className="text-gray-600">
          Contoh akun yang umum digunakan: Kas, Bank, Piutang, Hutang, Pendapatan, Biaya Operasional, dll.
        </p>
      </motion.div>
    </div>
  );
};

export default Akun;