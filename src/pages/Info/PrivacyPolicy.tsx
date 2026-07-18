import { Shield, Lock, FileText, Trash2, Eye } from 'lucide-react';
import { SEO } from '../../components/common/SEO';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-8 pb-12" style={{ background: 'linear-gradient(160deg, #FFFCF5 0%, #FFF8EB 50%, #FFFCF5 100%)' }}>
      <SEO 
        title="Privacy Policy | Vivahvedh" 
        description="Learn how Vivahvedh protects your data. We take your privacy securely."
      />
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-premium border border-border overflow-hidden">
          <div className="relative px-8 py-10 border-b border-border">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-kumkum-500 via-haldi-500 to-kumkum-500" />
            <span className="text-haldi-500 text-xs font-ui font-bold uppercase tracking-[0.3em] mb-2 block">गोपनीयता • Privacy</span>
            <h1 className="text-3xl font-display font-bold text-primary mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground font-ui text-sm">Last updated: July 2026</p>
          </div>

          <div className="p-8 space-y-8 text-muted-foreground font-sans">
            <div className="p-4 bg-haldi-50 text-haldi-700 rounded-xl border border-haldi-500/20 text-sm">
              <strong className="block mb-1 font-ui">Disclaimer:</strong> 
              This is a standard template for informational purposes. Please consult with a legal professional to ensure full compliance with the Digital Personal Data Protection (DPDP) Act 2023 of India.
            </div>

            <section>
              <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <FileText className="text-primary" size={24} />
                1. Data We Collect
              </h2>
              <p className="mb-4">To provide you with our matchmaking services, we collect various types of personal information, including but not limited to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Profile Information:</strong> Name, gender, birth date, religion, caste, sub-caste.</li>
                <li><strong>Contact Information:</strong> Email address, mobile number.</li>
                <li><strong>Physical & Health Details:</strong> Height, weight, blood group, medical reports.</li>
                <li><strong>Family & Education:</strong> Educational qualifications, income details, family background.</li>
                <li><strong>Sensitive Documents:</strong> KYC documents (Aadhaar, PAN, Passport), income proofs, and payment screenshots.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <Shield className="text-primary" size={24} />
                2. How We Use Your Data
              </h2>
              <p className="mb-4">Your personal data is used strictly for the purpose of facilitating matchmaking:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Creating and managing your matrimonial profile.</li>
                <li>Verifying your identity and credentials to maintain platform safety.</li>
                <li>Matching algorithms and search functionalities.</li>
                <li>Communicating with you regarding platform updates, matches, and security notices.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <Eye className="text-primary" size={24} />
                3. Data Sharing & Visibility
              </h2>
              <p className="mb-4">We respect your privacy and limit the sharing of your data:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Public Profile:</strong> Basic information and primary photo are visible to other members.</li>
                <li><strong>Full Gallery & Contact Details:</strong> Only visible to users with an ACCEPTED connection, SILVER/GOLD paid members, or administrators.</li>
                <li><strong>Sensitive Documents:</strong> KYC, income proofs, and medical reports are NEVER shared publicly. They are stored securely and only accessed by administrators for verification purposes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <Lock className="text-primary" size={24} />
                4. Data Security & Encryption
              </h2>
              <p className="mb-4">
                We employ industry-standard security measures to protect your data. All sensitive Personally Identifiable Information (PII) such as mobile numbers, emails, and sensitive document URLs are encrypted at rest in our database using AES-256-GCM encryption. Documents are securely stored in the cloud with authenticated, time-limited access URLs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <Trash2 className="text-primary" size={24} />
                5. Data Retention & Deletion
              </h2>
              <p className="mb-4">
                We retain your data only as long as your account is active or as required for legal/administrative purposes.
                If you request account deletion, administrators can perform a hard-delete that cascades and permanently removes all your associated data, connections, and images from our active systems.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-foreground mb-4">6. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or your personal data, please contact us at support@vivahvedh.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
