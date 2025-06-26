import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab } from '@headlessui/react';
import TransaksiForm from '../components/Transaksi/TransaksiForm';
import type { TransaksiData } from '../components/Transaksi/TransaksiForm';
import OCRTransaksiForm from '../components/Transaksi/OCRTransaksiForm';
import TransaksiList from '../components/Transaksi/TransaksiList';
import LocalStorageService from '../services/LocalStorageService';
import GoogleSheetsService from '../services/GoogleSheetsService';
import { 
  CurrencyDollarIcon, 
  ArrowPathIcon, 
  CameraIcon, 
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  PlusIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Input Transaksi</h1>
            <p className="text-gray-600">
              Catat transaksi keuangan secara manual atau via screenshot untuk memudahkan pencatatan
            </p>
          </div>
        </div>
        
        {/* Online/Offline Status */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`h-4 w-4 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} flex-shrink-0`}></div>
            <span className="text-sm font-medium text-gray-700">
              Status: {isOnline ? 'Online' : 'Offline'}
            </span>
            {isOnline && (
              <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">
                Siap sinkronisasi
              </span>
            )}
            {!isOnline && (
              <span className="text-xs bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full">
                Penyimpanan lokal
              </span>
            )}
          </div>
          <AnimatePresence>
            {syncStatus && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg"
              >
                <ArrowPathIcon className={`h-4 w-4 ${syncStatus.includes('Menyinkronkan') ? 'animate-spin' : ''}`} />
                <span>{syncStatus}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Tabs for Manual and OCR Input */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex bg-gray-50 border-b border-gray-200">
            <Tab
              className={({ selected }) =>
                `flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors focus:outline-none
                ${selected
                  ? 'bg-white text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'}`
              }
            >
              <PlusIcon className="h-5 w-5" />
              Input Manual
          </Tab>
          <Tab
            className={({ selected }) =>
              `flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors focus:outline-none
              ${selected
                ? 'bg-white text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'}`
            }
          >
            <CameraIcon className="h-5 w-5" />
            Input via Screenshot
          </Tab>
        </Tab.List>
        <Tab.Panels className="p-6">
          <Tab.Panel>
            <div className="max-w-3xl mx-auto">
              <TransaksiForm 
                onSubmit={handleSubmitTransaction} 
                accounts={accounts} 
              />
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="max-w-3xl mx-auto">
              <OCRTransaksiForm 
                onSubmit={handleSubmitTransaction} 
                accounts={accounts} 
              />
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      </div>
      
      {/* Transaction List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-lg">
              <ClockIcon className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Riwayat Transaksi</h2>
          </div>
          <span className="text-sm bg-gray-100 text-gray-700 py-1 px-3 rounded-full">
            {transactions.length} Transaksi
          </span>
        </div>
        
        <TransaksiList 
          transactions={transactions} 
          onDelete={handleDeleteTransaction} 
        />
      </motion.div>
    </div>
  );
};

export default Transaksi;