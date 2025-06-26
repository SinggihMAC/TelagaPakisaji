import { useState } from 'react';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="form-container"
    >
      <h2 className="text-xl font-semibold text-primary mb-4">Manajemen Chart of Account (COA)</h2>
      
      <form onSubmit={handleAddAccount} className="mb-6">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-grow">
            <input
              type="text"
              value={newAccount}
              onChange={(e) => setNewAccount(e.target.value)}
              placeholder="Nama akun baru"
              className="input-field w-full"
            />
          </div>
          <button type="submit" className="btn-primary whitespace-nowrap">
            Tambah Akun
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </form>
      
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nama Akun</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length > 0 ? (
              accounts.map((account, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td>
                    {editingAccount && editingAccount.original === account ? (
                      <form onSubmit={handleEditSubmit} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingAccount.edited}
                          onChange={(e) => setEditingAccount({ ...editingAccount, edited: e.target.value })}
                          className="input-field w-full"
                          autoFocus
                        />
                      </form>
                    ) : (
                      account
                    )}
                  </td>
                  <td className="text-right">
                    {editingAccount && editingAccount.original === account ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleEditSubmit}
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => startEditing(account)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(account)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center py-4 text-gray-500">
                  Belum ada akun yang ditambahkan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AkunManager;