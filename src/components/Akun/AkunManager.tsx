import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  CheckIcon,
  XMarkIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface AkunManagerProps {
  accounts: string[];
  onAddAccount: (account: string) => void;
  onEditAccount: (oldName: string, newName: string) => void;
  onDeleteAccount: (account: string) => void;
}

const AkunManager = ({ accounts, onAddAccount, onEditAccount, onDeleteAccount }: AkunManagerProps) => {
  const [newAccount, setNewAccount] = useState<string>('');
  const [editingAccount, setEditingAccount] = useState<{ original: string; edited: string } | null>(null);
  const [error, setError] = useState<string>('');

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAccount.trim()) {
      setError('Nama akun tidak boleh kosong');
      return;
    }
    
    if (accounts.includes(newAccount)) {
      setError('Akun dengan nama tersebut sudah ada');
      return;
    }
    
    onAddAccount(newAccount);
    setNewAccount('');
    setError('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingAccount) return;
    
    if (!editingAccount.edited.trim()) {
      setError('Nama akun tidak boleh kosong');
      return;
    }
    
    if (editingAccount.original !== editingAccount.edited && 
        accounts.includes(editingAccount.edited)) {
      setError('Akun dengan nama tersebut sudah ada');
      return;
    }
    
    onEditAccount(editingAccount.original, editingAccount.edited);
    setEditingAccount(null);
    setError('');
  };

  const startEditing = (account: string) => {
    setEditingAccount({ original: account, edited: account });
    setError('');
  };

  const cancelEditing = () => {
    setEditingAccount(null);
    setError('');
  };

  const confirmDelete = (account: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus akun "${account}"?`)) {
      onDeleteAccount(account);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-primary mb-6 flex items-center">
        Daftar Akun
        <span className="ml-2 text-sm bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
          {accounts.length}
        </span>
      </h2>
      
      <form onSubmit={handleAddAccount} className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-grow relative">
            <input
              type="text"
              value={newAccount}
              onChange={(e) => setNewAccount(e.target.value)}
              placeholder="Nama akun baru"
              className="input-field w-full pl-10 py-3"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <PlusIcon className="h-5 w-5" />
            </div>
          </div>
          <button 
            type="submit" 
            className="btn-primary whitespace-nowrap flex items-center justify-center gap-2 py-3"
          >
            <PlusIcon className="h-5 w-5" />
            Tambah Akun
          </button>
        </div>
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center text-red-500 text-sm mt-2 gap-1"
            >
              <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Nama Akun</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700 w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length > 0 ? (
              accounts.map((account, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, backgroundColor: '#f0f9ff' }}
                  animate={{ opacity: 1, backgroundColor: '#ffffff' }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    {editingAccount && editingAccount.original === account ? (
                      <form onSubmit={handleEditSubmit} className="flex items-center gap-2">
                        <div className="relative w-full">
                          <input
                            type="text"
                            value={editingAccount.edited}
                            onChange={(e) => setEditingAccount({ ...editingAccount, edited: e.target.value })}
                            className="input-field w-full pl-8 py-2 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                            autoFocus
                          />
                          <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-blue-500">
                            <PencilIcon className="h-4 w-4" />
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="font-medium text-gray-700">{account}</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {editingAccount && editingAccount.original === account ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleEditSubmit}
                          className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                          title="Simpan"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          title="Batal"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => startEditing(account)}
                          className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(account)}
                          className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          title="Hapus"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <PlusIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <p>Belum ada akun yang ditambahkan.</p>
                    <p className="text-sm text-gray-400">Tambahkan akun baru menggunakan form di atas.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AkunManager;