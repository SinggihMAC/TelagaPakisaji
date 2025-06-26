import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tab } from '@headlessui/react';
import LaporanPlaceholder from '../components/Laporan/LaporanPlaceholder';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  ScaleIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { saveAs } from 'file-saver';

const Laporan = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const handleExportCSV = () => {
    // Placeholder function for CSV export
    // In a real implementation, this would generate a CSV file from the transaction data
    const csvContent = 'Tanggal,Bulan,Tahun,Keterangan,Akun,Debit,Kredit\n01/01/2023,01,2023,Contoh Transaksi,Kas_Kantin,100000,0';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'laporan_keuangan.csv');
  };

  const handleExportPDF = () => {
    // Placeholder function for PDF export
    // In a real implementation, this would generate a PDF file from the transaction data
    alert('Fitur export PDF akan segera tersedia!');
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
          Laporan Keuangan
        </h1>
        <p className="text-gray-600">
          Lihat dan unduh laporan keuangan Telaga Pakisaji
        </p>
      </motion.div>
      
      {/* Export Buttons */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 justify-center">
        <button 
          onClick={handleExportCSV}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <DocumentArrowDownIcon className="h-5 w-5" />
          Export CSV
        </button>
        <button 
          onClick={handleExportPDF}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <DocumentArrowDownIcon className="h-5 w-5" />
          Export PDF
        </button>
      </div>
      
      {/* Tabs for Different Reports */}
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
            Omzet
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors
              ${selected
                ? 'bg-primary text-white shadow'
                : 'text-primary hover:bg-primary/20'}`
            }
          >
            Laba Rugi
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors
              ${selected
                ? 'bg-primary text-white shadow'
                : 'text-primary hover:bg-primary/20'}`
            }
          >
            Neraca
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="grid grid-cols-1 gap-6">
              <LaporanPlaceholder 
                title="Laporan Omzet"
                description="Lihat total pendapatan dan pengeluaran berdasarkan periode"
                icon={<CurrencyDollarIcon />}
              />
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="grid grid-cols-1 gap-6">
              <LaporanPlaceholder 
                title="Laporan Laba Rugi"
                description="Analisis laba dan rugi berdasarkan kategori pendapatan dan biaya"
                icon={<ChartBarIcon />}
              />
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="grid grid-cols-1 gap-6">
              <LaporanPlaceholder 
                title="Laporan Neraca"
                description="Lihat posisi keuangan dengan aset, kewajiban, dan ekuitas"
                icon={<ScaleIcon />}
              />
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      
      {/* Placeholder for Future Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-12 bg-gray-50 rounded-lg p-6 text-center border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-primary mb-4">Fitur Mendatang</h2>
        <p className="text-gray-600 mb-2">
          Kami sedang mengembangkan fitur laporan yang lebih lengkap, termasuk:
        </p>
        <ul className="text-gray-600 list-disc list-inside mb-4">
          <li>Grafik dan visualisasi data</li>
          <li>Filter berdasarkan periode dan kategori</li>
          <li>Analisis tren keuangan</li>
          <li>Dashboard keuangan interaktif</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default Laporan;