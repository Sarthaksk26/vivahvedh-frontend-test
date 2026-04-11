import { useState } from 'react';
import apiClient from '../../lib/apiClient';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/public/contact', formData);
      setSent(true);
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12 mb-20">
      <h1 className="text-4xl font-extrabold mb-4">Contact Us</h1>
      <p className="text-lg text-muted-foreground mb-10">
        Have a question about subscriptions, matching algorithms, or account deletion? Drop our administration team a secure line below.
      </p>

      {sent ? (
        <div className="bg-green-100 text-green-800 p-8 rounded-2xl text-center shadow-sm">
          <h2 className="text-2xl font-bold mb-2">Message Received!</h2>
          <p>Our support team will connect with you via email shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-card border p-8 rounded-3xl shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Full Name</label>
            <input required type="text" className="w-full h-12 px-4 border rounded-xl" onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Email Address</label>
              <input required type="email" className="w-full h-12 px-4 border rounded-xl" onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Mobile Number</label>
              <input required type="text" className="w-full h-12 px-4 border rounded-xl" onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Your Message</label>
            <textarea required className="w-full min-h-[150px] p-4 border rounded-xl" onChange={e => setFormData({...formData, message: e.target.value})} />
          </div>

          <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all text-lg shadow-md">
            Send Secure Message
          </button>
        </form>
      )}
    </div>
  );
}
