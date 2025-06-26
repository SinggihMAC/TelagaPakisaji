import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { createWorker } from 'tesseract.js';
import type { TransaksiData } from './TransaksiForm';

interface OCRTransaksiFormProps {
  onSubmit: (data: TransaksiData) => void;
  accounts: string[];
}

const OCRTransaksiForm = ({ onSubmit, accounts }: OCRTransaksiFormProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [ocrText, setOcrText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [parsedData, setParsedData] = useState<Partial<TransaksiData> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Reset OCR text and parsed data
      setOcrText('');
      setParsedData(null);
    }
  };

  const processImage = async () => {
    if (!image) return;
    
    setIsProcessing(true);
    
    try {
      const worker = await createWorker('ind');
      const { data: { text } } = await worker.recognize(image);
      setOcrText(text);
      
      // Try to parse the OCR text to extract transaction data
      const parsedData = parseOCRText(text);
      if (parsedData) {
        setParsedData(parsedData);
      }
      
      await worker.terminate();
    } catch (error) {
      console.error('OCR Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Simple parser for OCR text - this is a basic implementation
  // In a real app, you would need a more sophisticated parser based on your specific chat format
  const parseOCRText = (text: string): Partial<TransaksiData> | null => {
    try {
      // Example parsing logic - adjust based on your WA chat format
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      // Try to find date in format DD/MM/YYYY or similar
      const dateRegex = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/;
      const dateMatch = text.match(dateRegex);
      
      // Try to find amounts (numbers with possible thousand separators)
      const amountRegex = /(?:Rp\.?|IDR)?\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\b/gi;
      const amounts = [];
      let match;
      while ((match = amountRegex.exec(text)) !== null) {
        amounts.push(match[1].replace(/[.,]/g, ''));
      }
      
      // Try to find a description
      let description = '';
      for (const line of lines) {
        if (line.length > 10 && !line.match(dateRegex) && !line.match(amountRegex)) {
          description = line.trim();
          break;
        }
      }
      
      // Create a partial transaction object with what we could parse
      const result: Partial<TransaksiData> = {};
      
      if (dateMatch) {
        const dateParts = dateMatch[1].split(/[\/\-]/);
        if (dateParts.length === 3) {
          // Assuming DD/MM/YYYY format
          const day = dateParts[0].padStart(2, '0');
          const month = dateParts[1].padStart(2, '0');
          let year = dateParts[2];
          if (year.length === 2) year = `20${year}`; // Convert 2-digit year to 4-digit
          
          result.tanggal = `${year}-${month}-${day}`;
          result.bulan = month;
          result.tahun = year;
        }
      }
      
      if (description) {
        result.keterangan = description;
      }
      
      if (amounts.length > 0) {
        // Assume first amount is debit and second is credit, or adjust as needed
        if (amounts.length >= 1) {
          result.debit = parseFloat(amounts[0]) || 0;
        }
        if (amounts.length >= 2) {
          result.kredit = parseFloat(amounts[1]) || 0;
        }
      }
      
      return Object.keys(result).length > 0 ? result : null;
    } catch (error) {
      console.error('Parsing error:', error);
      return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target as HTMLFormElement);
    const data: any = {};
    
    // Convert form data to TransaksiData object
    formData.forEach((value, key) => {
      if (key === 'debit' || key === 'kredit') {
        data[key] = parseFloat(value as string) || 0;
      } else {
        data[key] = value;
      }
    });
    
    onSubmit(data as TransaksiData);
    
    // Reset form
    setImage(null);
    setPreview('');
    setOcrText('');
    setParsedData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="form-container"
    >
      <h2 className="text-xl font-semibold text-primary mb-4">Input Transaksi via Screenshot</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Screenshot Chat WA
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-white
            hover:file:bg-primary-dark"
        />
      </div>
      
      {preview && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">Preview Gambar</h3>
            <img 
              src={preview} 
              alt="Preview" 
              className="max-w-full h-auto border rounded-md"
              style={{ maxHeight: '300px' }}
            />
            <div className="mt-3">
              <button
                type="button"
                onClick={processImage}
                disabled={isProcessing}
                className="btn-secondary w-full"
              >
                {isProcessing ? 'Memproses...' : 'Proses OCR'}
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">Hasil OCR</h3>
            <textarea
              value={ocrText}
              onChange={(e) => setOcrText(e.target.value)}
              className="input-field w-full h-64"
              placeholder="Hasil OCR akan muncul di sini setelah gambar diproses..."
            />
          </div>
        </div>
      )}
      
      {ocrText && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-md font-medium text-gray-700 mb-2">Konfirmasi Data Transaksi</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="ocr-tanggal" className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                id="ocr-tanggal"
                name="tanggal"
                defaultValue={parsedData?.tanggal || ''}
                className="input-field w-full"
                required
              />
            </div>
            
            <div>
              <label htmlFor="ocr-bulan" className="block text-sm font-medium text-gray-700 mb-1">
                Bulan
              </label>
              <input
                type="text"
                id="ocr-bulan"
                name="bulan"
                defaultValue={parsedData?.bulan || ''}
                className="input-field w-full"
                required
              />
            </div>
            
            <div>
              <label htmlFor="ocr-tahun" className="block text-sm font-medium text-gray-700 mb-1">
                Tahun
              </label>
              <input
                type="text"
                id="ocr-tahun"
                name="tahun"
                defaultValue={parsedData?.tahun || ''}
                className="input-field w-full"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="ocr-keterangan" className="block text-sm font-medium text-gray-700 mb-1">
              Keterangan
            </label>
            <textarea
              id="ocr-keterangan"
              name="keterangan"
              defaultValue={parsedData?.keterangan || ''}
              rows={3}
              className="input-field w-full"
              required
            />
          </div>
          
          <div>
            <label htmlFor="ocr-akun" className="block text-sm font-medium text-gray-700 mb-1">
              Akun
            </label>
            <select
              id="ocr-akun"
              name="akun"
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
              <label htmlFor="ocr-debit" className="block text-sm font-medium text-gray-700 mb-1">
                Debit
              </label>
              <input
                type="number"
                id="ocr-debit"
                name="debit"
                defaultValue={parsedData?.debit || 0}
                className="input-field w-full"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label htmlFor="ocr-kredit" className="block text-sm font-medium text-gray-700 mb-1">
                Kredit
              </label>
              <input
                type="number"
                id="ocr-kredit"
                name="kredit"
                defaultValue={parsedData?.kredit || 0}
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
      )}
    </motion.div>
  );
};

export default OCRTransaksiForm;