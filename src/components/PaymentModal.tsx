import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import apiClient from '../lib/apiClient';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: 'SILVER' | 'GOLD';
  price: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, planType, price }) => {
  const [txId, setTxId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (onClose) setSubmitted(false);
  }, [isOpen]);

  const generateUPIUrl = () => {
    const vpa = "YOUR_VPA@okaxis"; // Replace with actual VPA
    const name = "Vivahvedh Matrimony";
    const txNote = `Plan_${planType}`;
    return `upi://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&am=${price}&cu=INR&tn=${encodeURIComponent(txNote)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txId || !file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('planType', planType);
    formData.append('amount', price.toString());
    formData.append('transactionId', txId);
    formData.append('screenshot', file);

    try {
      await apiClient.post('/payments/verify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSubmitted(true);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {planType === 'GOLD' ? 'गोल्ड योजना — Gold Plan' : 'सिल्व्हर योजना — Silver Plan'}
            </h2>
            <p className="text-sm text-gray-500">कृपया खालील सूचनांचे पालन करा — Please follow instructions below</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {submitted ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">अर्ज सादर झाला! — Submission Received!</h3>
            <p className="text-gray-600 max-w-xs mx-auto">
              तुमचा पेमेंट पुरावा मिळाला आहे. आम्ही पडताळणी करून तुम्हाला सूचित करू. <br />
              Your payment proof has been received. We will notify you after verification.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all"
            >
              ठीक आहे — Okay
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-8">
            {/* QR Section */}
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <QRCodeCanvas value={generateUPIUrl()} size={200} />
              </div>
              <div className="mt-4 text-center">
                <p className="font-bold text-lg text-gray-800">₹{price}</p>
                <p className="text-sm text-gray-500">स्कॅन करा आणि पैसे द्या <br /> Scan and Pay</p>
              </div>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  व्यवहार आयडी — Transaction ID
                </label>
                <input
                  type="text"
                  required
                  value={txId}
                  onChange={(e) => setTxId(e.target.value)}
                  placeholder="उदा. 123456789012"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  पेमेंट स्क्रीनशॉट — Payment Screenshot
                </label>
                <div
                  className={`relative group border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer
                    ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-primary bg-gray-50'}`}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <div className="flex flex-col items-center justify-center py-2">
                    <Upload className={`w-8 h-8 mb-2 ${file ? 'text-green-600' : 'text-gray-400 group-hover:text-primary transition-colors'}`} />
                    <span className="text-sm font-medium text-gray-600">
                      {file ? file.name : 'फोटो अपलोड करा — Upload Photo'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !txId || !file}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg
                  ${loading || !txId || !file
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90 active:scale-[0.98]'}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    प्रक्रिया सुरू आहे... Processing...
                  </span>
                ) : (
                  'पुष्टीकरण करा — Confirm Submission'
                )}
              </button>
            </form>

            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-blue-700 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>
                तुमच्या पेमेंटची पडताळणी करण्यासाठी प्रशासकाला २४-४८ तास लागू शकतात. <br />
                Verification may take 24-48 hours.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
