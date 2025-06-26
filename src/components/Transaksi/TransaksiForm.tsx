import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TransaksiFormProps {
  onSubmit: (data: TransaksiData) => void;
  accounts: string[];
}

export interface TransaksiData {
  tanggal: string;
  bulan: string;
  tahun: string;
  keterangan: string;
  akun: string;
  debit: number;
  kredit: number;
}

const TransaksiForm = ({ onSubmit, accounts }: TransaksiFormProps) => {
  const [formData, setFormData] = useState<TransaksiData>({
    tanggal: '',
    bulan: '',
    tahun: '',
    keterangan: '',
    akun: '',
    debit: 0,
    kredit: 0
  });

  // Set default date values when component mounts
  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear().toString();
    
    setFormData(prev => ({
      ...prev,
      tanggal: `${year}-${month}-${day}`,
      bulan: month,
      tahun: year
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // If the date field changes, update tanggal, bulan, and tahun
    if (name === 'tanggal') {
      const [year, month, day] = value.split('-');
      setFormData({
        ...formData,
        tanggal: value,
        bulan: month,
        tahun: year
      });
    } else if (name === 'debit' || name === 'kredit') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    
    // Reset form (except date fields)
    setFormData({
      ...formData,
      keterangan: '',
      akun: '',
      debit: 0,
      kredit: 0
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="form-container"
    >
      <h2 className="text-xl font-semibold text-primary mb-4">Input Transaksi Manual</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal
            </label>
            <input
              type="date"
              id="tanggal"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              className="input-field w-full"
              required
            />
          </div>
          
          <div>
            <label htmlFor="bulan" className="block text-sm font-medium text-gray-700 mb-1">
              Bulan
            </label>
            <input
              type="text"
              id="bulan"
              name="bulan"
              value={formData.bulan}
              className="input-field w-full bg-gray-100"
              readOnly
            />
          </div>
          
          <div>
            <label htmlFor="tahun" className="block text-sm font-medium text-gray-700 mb-1">
              Tahun
            </label>
            <input
              type="text"
              id="tahun"
              name="tahun"
              value={formData.tahun}
              className="input-field w-full bg-gray-100"
              readOnly
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-1">
            Keterangan
          </label>
          <textarea
            id="keterangan"
            name="keterangan"
            value={formData.keterangan}
            onChange={handleChange}
            rows={3}
            className="input-field w-full"
            required
          />
        </div>
        
        <div>
          <label htmlFor="akun" className="block text-sm font-medium text-gray-700 mb-1">
            Akun
          </label>
          <select
            id="akun"
            name="akun"
            value={formData.akun}
            onChange={handleChange}
            className="input-field w-full"
            required
          >
            <option value="">Pilih Akun</option>
            {accounts.map((account, index) => (
              <option key={index} value={account}>
                {account}
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="debit" className="block text-sm font-medium text-gray-700 mb-1">
              Debit
            </label>
            <input
              type="number"
              id="debit"
              name="debit"
              value={formData.debit || ''}
              onChange={handleChange}
              className="input-field w-full"
              min="0"
              step="0.01"
            />
          </div>
          
          <div>
            <label htmlFor="kredit" className="block text-sm font-medium text-gray-700 mb-1">
              Kredit
            </label>
            <input
              type="number"
              id="kredit"
              name="kredit"
              value={formData.kredit || ''}
              onChange={handleChange}
              className="input-field w-full"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button type="submit" className="btn-primary">
            Simpan Transaksi
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TransaksiForm;