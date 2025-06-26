import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AkunManager from '../components/Akun/AkunManager';
import LocalStorageService from '../services/LocalStorageService';
import { 
  UserGroupIcon, 
  ExclamationCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

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
    <div className="max-w-6xl mx-auto px-4 py-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2 flex items-center">
            <UserGroupIcon className="h-8 w-8 mr-2 text-primary" />
            Manajemen Akun
          </h1>
          <p className="text-gray-600">
            Kelola chart of account (COA) untuk pencatatan keuangan
          </p>
        </div>
        <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full font-medium flex items-center">
          <span>{accounts.length}</span>
          <span className="ml-1">Akun</span>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center"
          >
            <ExclamationCircleIcon className="h-5 w-5 mr-2 text-red-500" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex justify-center items-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="loading-spinner" />
              <span className="ml-3 text-gray-600">Memuat data...</span>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            >
              <AkunManager 
                accounts={accounts}
                onAddAccount={handleAddAccount}
                onEditAccount={handleEditAccount}
                onDeleteAccount={handleDeleteAccount}
              />
            </motion.div>
          )}
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-fit"
        >
          <h2 className="text-xl font-semibold text-primary mb-4 flex items-center">
            <InformationCircleIcon className="h-6 w-6 mr-2 text-primary" />
            Tentang Chart of Account
          </h2>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              Chart of Account (COA) adalah daftar akun keuangan yang digunakan untuk mengkategorikan transaksi keuangan. 
              Dengan COA yang terstruktur, Anda dapat dengan mudah:
            </p>
            
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-2 mt-0.5">✓</span>
                <span>Melacak arus kas masuk dan keluar</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-2 mt-0.5">✓</span>
                <span>Membuat laporan keuangan yang akurat</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-2 mt-0.5">✓</span>
                <span>Menganalisis kinerja keuangan</span>
              </li>
            </ul>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="font-medium text-primary mb-2">Contoh Akun Umum:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 px-3 py-2 rounded">Kas</div>
                <div className="bg-gray-50 px-3 py-2 rounded">Bank</div>
                <div className="bg-gray-50 px-3 py-2 rounded">Piutang</div>
                <div className="bg-gray-50 px-3 py-2 rounded">Hutang</div>
                <div className="bg-gray-50 px-3 py-2 rounded">Pendapatan</div>
                <div className="bg-gray-50 px-3 py-2 rounded">Biaya</div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="font-medium text-primary mb-2">Aksi yang Tersedia:</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <PlusIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span>Tambah akun baru</span>
                </div>
                <div className="flex items-center text-sm">
                  <PencilIcon className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Edit nama akun</span>
                </div>
                <div className="flex items-center text-sm">
                  <TrashIcon className="h-4 w-4 text-red-500 mr-2" />
                  <span>Hapus akun (jika tidak ada transaksi)</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Akun;