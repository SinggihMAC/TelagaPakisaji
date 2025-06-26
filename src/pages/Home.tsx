import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CurrencyDollarIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  CogIcon 
} from '@heroicons/react/24/outline';

const Home = () => {
  const features = [
    {
      title: 'Input Transaksi',
      description: 'Input transaksi keuangan secara manual atau via screenshot chat WA',
      icon: <CurrencyDollarIcon className="h-8 w-8" />,
      link: '/transaksi',
      color: 'bg-primary'
    },
    {
      title: 'Laporan Keuangan',
      description: 'Lihat laporan omzet, laba-rugi, dan neraca',
      icon: <ChartBarIcon className="h-8 w-8" />,
      link: '/laporan',
      color: 'bg-secondary'
    },
    {
      title: 'Manajemen Akun',
      description: 'Kelola chart of account (COA) untuk pencatatan keuangan',
      icon: <CogIcon className="h-8 w-8" />,
      link: '/akun',
      color: 'bg-primary-dark'
    },
    {
      title: 'Export Data',
      description: 'Export laporan keuangan ke format CSV atau PDF',
      icon: <DocumentTextIcon className="h-8 w-8" />,
      link: '/laporan',
      color: 'bg-secondary-dark'
    }
  ];

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          Keuangan Telaga Pakisaji
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Aplikasi pengelolaan keuangan untuk memudahkan pencatatan dan pelaporan transaksi keuangan
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Link to={feature.link} className="block h-full">
              <div className="card h-full flex items-center p-6 hover:shadow-lg transition-shadow">
                <div className={`${feature.color} text-white p-3 rounded-full mr-4`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-12 bg-primary text-white rounded-lg p-6 text-center"
      >
        <h2 className="text-2xl font-semibold mb-4">Mulai Kelola Keuangan Anda</h2>
        <p className="mb-6">Catat transaksi, kelola akun, dan lihat laporan keuangan dengan mudah</p>
        <Link to="/transaksi" className="inline-block bg-white text-primary font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition-colors">
          Input Transaksi Sekarang
        </Link>
      </motion.div>
    </div>
  );
};

export default Home;