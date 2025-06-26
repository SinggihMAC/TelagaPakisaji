import { useState } from 'react';
import { motion } from 'framer-motion';
import type { TransaksiData } from './TransaksiForm';

interface TransaksiListProps {
  transactions: TransaksiData[];
  onDelete: (index: number) => void;
}

const TransaksiList = ({ transactions, onDelete }: TransaksiListProps) => {
  const [sortField, setSortField] = useState<keyof TransaksiData>('tanggal');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<string>('');

  const handleSort = (field: keyof TransaksiData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter and sort transactions
  const filteredAndSortedTransactions = transactions
    .filter(transaction => {
      if (!filter) return true;
      const searchTerm = filter.toLowerCase();
      return (
        transaction.keterangan.toLowerCase().includes(searchTerm) ||
        transaction.akun.toLowerCase().includes(searchTerm) ||
        transaction.tanggal.includes(searchTerm)
      );
    })
    .sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === 'asc'
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      } else if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      }
      
      return 0;
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="form-container"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary mb-2 md:mb-0">Daftar Transaksi</h2>
        
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Cari transaksi..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field w-full"
          />
        </div>
      </div>
      
      {filteredAndSortedTransactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th 
                  onClick={() => handleSort('tanggal')}
                  className="cursor-pointer hover:bg-primary-dark"
                >
                  Tanggal {sortField === 'tanggal' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('keterangan')}
                  className="cursor-pointer hover:bg-primary-dark"
                >
                  Keterangan {sortField === 'keterangan' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('akun')}
                  className="cursor-pointer hover:bg-primary-dark"
                >
                  Akun {sortField === 'akun' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('debit')}
                  className="cursor-pointer hover:bg-primary-dark text-right"
                >
                  Debit {sortField === 'debit' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('kredit')}
                  className="cursor-pointer hover:bg-primary-dark text-right"
                >
                  Kredit {sortField === 'kredit' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTransactions.map((transaction, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td>{new Date(transaction.tanggal).toLocaleDateString('id-ID')}</td>
                  <td>{transaction.keterangan}</td>
                  <td>{transaction.akun}</td>
                  <td className="text-right">{formatCurrency(transaction.debit)}</td>
                  <td className="text-right">{formatCurrency(transaction.kredit)}</td>
                  <td>
                    <button
                      onClick={() => onDelete(index)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      Hapus
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {filter ? 'Tidak ada transaksi yang sesuai dengan pencarian.' : 'Belum ada transaksi.'}
        </div>
      )}
    </motion.div>
  );
};

export default TransaksiList;