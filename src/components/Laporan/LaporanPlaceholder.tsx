import { motion } from 'framer-motion';

interface LaporanPlaceholderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const LaporanPlaceholder = ({ title, description, icon }: LaporanPlaceholderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center"
    >
      <div className="text-primary mb-4 text-4xl">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <button className="btn-primary mt-2">
        Lihat Laporan
      </button>
    </motion.div>
  );
};

export default LaporanPlaceholder;