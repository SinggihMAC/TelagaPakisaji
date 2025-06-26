import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tab } from '@headlessui/react';
import TransaksiForm from '../components/Transaksi/TransaksiForm';
import type { TransaksiData } from '../components/Transaksi/TransaksiForm';
import OCRTransaksiForm from '../components/Transaksi/OCRTransaksiForm';
import TransaksiList from '../components/Transaksi/TransaksiList';
import LocalStorageService from '../services/LocalStorageService';
import GoogleSheetsService from '../services/GoogleSheetsService';

const Transaksi = () => {
  const [transactions, setTransactions] = useState<TransaksiData[]>([]);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<number>(0);

  // Load accounts and transactions on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Initialize default accounts if needed
        await LocalStorageService.initializeDefaultAccounts();
        
        // Load accounts
        const accounts = await LocalStorageService.getAccounts();
        setAccounts(accounts);
        
        // Load transactions
        const transactions = await LocalStorageService.getTransactions();
        setTransactions(transactions);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
    
    // Set up online/offline event listeners
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingTransactions();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle transaction submission
  const handleSubmitTransaction = async (data: TransaksiData) => {
    try {
      // Save to local storage
      await LocalStorageService.addTransaction(data);
      
      // Update state
      setTransactions(prev => [...prev, data]);
      
      // If online, sync to Google Sheets
      if (isOnline) {
        try {
          setSyncStatus('Menyinkronkan ke Google Sheets...');
          await GoogleSheetsService.addTransaction(data);
          setSyncStatus('Berhasil disinkronkan');
          setTimeout(() => setSyncStatus(''), 3000);
        } catch (error) {
          console.error('Error syncing to Google Sheets:', error);
          setSyncStatus('Gagal sinkronisasi, akan dicoba lagi nanti');
          await LocalStorageService.addToPendingSync(data);
        }
      } else {
        // Add to pending sync queue
        await LocalStorageService.addToPendingSync(data);
        setSyncStatus('Transaksi disimpan offline, akan disinkronkan saat online');
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
    }
  };

  // Sync pending transactions when online
  const syncPendingTransactions = async () => {
    if (!isOnline) return;
    
    try {
      const pendingTransactions = await LocalStorageService.getPendingSync();
      
      if (pendingTransactions.length > 0) {
        setSyncStatus(`Menyinkronkan ${pendingTransactions.length} transaksi tertunda...`);
        
        for (const transaction of pendingTransactions) {
          try {
            if (transaction.id) {
              await GoogleSheetsService.addTransaction(transaction);
              await LocalStorageService.removeFromPendingSync(transaction.id);
            }
          } catch (error) {
            console.error('Error syncing pending transaction:', error);
            // Stop trying to sync if there's an error
            break;
          }
        }
        
        setSyncStatus('Sinkronisasi selesai');
        setTimeout(() => setSyncStatus(''), 3000);
      }
    } catch (error) {
      console.error('Error syncing pending transactions:', error);
      setSyncStatus('Gagal sinkronisasi, akan dicoba lagi nanti');
    }
  };

  // Handle transaction deletion
  const handleDeleteTransaction = async (index: number) => {
    try {
      const transaction = transactions[index];
      const allTransactions = await LocalStorageService.getTransactions();
      
      // Find the transaction in the database by matching properties
      const dbTransaction = allTransactions.find(t => 
        t.tanggal === transaction.tanggal &&
        t.keterangan === transaction.keterangan &&
        t.akun === transaction.akun &&
        t.debit === transaction.debit &&
        t.kredit === transaction.kredit
      );
      
      if (dbTransaction && dbTransaction.id) {
        await LocalStorageService.deleteTransaction(dbTransaction.id);
        
        // Update state
        setTransactions(prev => prev.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
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
          Input Transaksi
        </h1>
        <p className="text-gray-600">
          Catat transaksi keuangan secara manual atau via screenshot chat WA
        </p>
      </motion.div>
      
      {/* Online/Offline Status */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        {syncStatus && (
          <div className="text-sm text-gray-600">
            {syncStatus}
          </div>
        )}
      </div>
      
      {/* Tabs for Manual and OCR Input */}
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-primary/10 p-1 mb-6">
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors
              ${selected
                ? 'bg-primary text-white shadow'
                : 'text-primary hover:bg-primary/20'}`
            }
          >
            Input Manual
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors
              ${selected
                ? 'bg-primary text-white shadow'
                : 'text-primary hover:bg-primary/20'}`
            }
          >
            Input via Screenshot
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <TransaksiForm 
              onSubmit={handleSubmitTransaction} 
              accounts={accounts} 
            />
          </Tab.Panel>
          <Tab.Panel>
            <OCRTransaksiForm 
              onSubmit={handleSubmitTransaction} 
              accounts={accounts} 
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      
      {/* Transaction List */}
      <div className="mt-8">
        <TransaksiList 
          transactions={transactions} 
          onDelete={handleDeleteTransaction} 
        />
      </div>
    </div>
  );
};

export default Transaksi;