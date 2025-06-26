import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  ArrowRightIcon,
  CameraIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const features = [
    {
      title: 'Transaksi Mudah',
      description: 'Catat transaksi keuangan dengan cepat dan mudah. Tambahkan detail seperti tanggal, keterangan, dan jumlah.',
      icon: <CurrencyDollarIcon className="h-8 w-8 text-primary-600" />,
      link: '/transaksi',
      linkText: 'Kelola Transaksi'
    },
    {
      title: 'Laporan Keuangan',
      description: 'Lihat laporan keuangan untuk memantau arus kas. Ekspor data ke format CSV atau PDF untuk analisis lebih lanjut.',
      icon: <ChartBarIcon className="h-8 w-8 text-primary-600" />,
      link: '/laporan',
      linkText: 'Lihat Laporan'
    },
    {
      title: 'Manajemen Akun',
      description: 'Kelola daftar akun untuk kategorisasi transaksi. Tambah, edit, atau hapus akun sesuai kebutuhan bisnis Anda.',
      icon: <UserGroupIcon className="h-8 w-8 text-primary-600" />,
      link: '/akun',
      linkText: 'Kelola Akun'
    },
    {
      title: 'OCR Transaksi',
      description: 'Gunakan teknologi pengenalan teks otomatis untuk mengekstrak data dari foto struk atau dokumen transaksi.',
      icon: <CameraIcon className="h-8 w-8 text-primary-600" />,
      link: '/transaksi/ocr',
      linkText: 'Coba OCR'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16 pt-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-500 text-transparent bg-clip-text">
          Aplikasi Keuangan Telaga Pakisaji
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Kelola transaksi keuangan dengan mudah dan efisien. Catat pemasukan dan pengeluaran, lihat laporan, dan kelola akun dengan antarmuka yang modern dan intuitif.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/transaksi" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
            Mulai Sekarang
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
          <Link to="/laporan" className="btn-outline inline-flex items-center gap-2 px-6 py-3">
            Lihat Laporan
            <ChartBarIcon className="h-5 w-5" />
          </Link>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={item}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 flex flex-col h-full"
          >
            <div className="mb-4 p-3 bg-primary-50 rounded-lg inline-block">
              {feature.icon}
            </div>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h2>
            <p className="text-gray-600 mb-6 flex-grow">
              {feature.description}
            </p>
            <Link to={feature.link} className="text-primary-600 font-medium inline-flex items-center hover:text-primary-700 transition-colors">
              {feature.linkText}
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl shadow-sm p-8 mb-16 border border-primary-100"
      >
        <div className="flex items-start gap-4">
          <DocumentTextIcon className="h-10 w-10 text-primary-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Tentang Aplikasi</h2>
            <p className="text-gray-700 mb-4">
              Aplikasi Keuangan Telaga Pakisaji dirancang untuk membantu pengelolaan keuangan dengan antarmuka yang modern dan mudah digunakan. Aplikasi ini memungkinkan Anda untuk mencatat transaksi, melihat laporan, dan mengelola akun dengan efisien.
            </p>
            <p className="text-gray-700">
              Dengan fitur OCR (Optical Character Recognition), Anda dapat menghemat waktu dengan mengekstrak data transaksi langsung dari foto struk atau dokumen. Semua data disimpan secara lokal dan dapat disinkronkan dengan Google Sheets untuk keamanan dan fleksibilitas.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Start Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Cara Memulai</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="bg-primary-100 text-primary-700 font-bold rounded-full w-8 h-8 flex items-center justify-center mb-4">1</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Atur Akun</h3>
            <p className="text-gray-600 mb-4">Buat dan atur akun-akun untuk kategorisasi transaksi keuangan Anda.</p>
            <Link to="/akun" className="text-primary-600 font-medium hover:text-primary-700 transition-colors">Kelola Akun</Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="bg-primary-100 text-primary-700 font-bold rounded-full w-8 h-8 flex items-center justify-center mb-4">2</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Catat Transaksi</h3>
            <p className="text-gray-600 mb-4">Tambahkan transaksi keuangan dengan detail lengkap atau gunakan fitur OCR.</p>
            <Link to="/transaksi" className="text-primary-600 font-medium hover:text-primary-700 transition-colors">Tambah Transaksi</Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="bg-primary-100 text-primary-700 font-bold rounded-full w-8 h-8 flex items-center justify-center mb-4">3</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Lihat Laporan</h3>
            <p className="text-gray-600 mb-4">Analisis keuangan melalui laporan omzet, laba rugi, dan neraca.</p>
            <Link to="/laporan" className="text-primary-600 font-medium hover:text-primary-700 transition-colors">Lihat Laporan</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;