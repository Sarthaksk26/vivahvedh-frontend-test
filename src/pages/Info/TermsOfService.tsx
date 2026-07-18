import { Scale, Users, ShieldAlert, CheckCircle } from 'lucide-react';
import { SEO } from '../../components/common/SEO';

export default function TermsOfService() {
  return (
    <div className="min-h-screen pt-8 pb-12" style={{ background: 'linear-gradient(160deg, #FFFCF5 0%, #FFF8EB 50%, #FFFCF5 100%)' }}>
      <SEO 
        title="Terms of Service | Vivahvedh" 
        description="Read our terms and conditions for using Vivahvedh matchmaking services."
      />
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-premium border border-border overflow-hidden">
          <div className="relative px-8 py-10 border-b border-border">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-kumkum-500 via-haldi-500 to-kumkum-500" />
            <span className="text-haldi-500 text-xs font-ui font-bold uppercase tracking-[0.3em] mb-2 block">अटी • Terms</span>
            <h1 className="text-3xl font-display font-bold text-primary mb-2">Terms of Service</h1>
            <p className="text-muted-foreground font-ui text-sm">Last updated: July 2026</p>
          </div>

          <div className="p-8 space-y-8 text-muted-foreground font-sans">
            <div className="p-4 bg-haldi-50 text-haldi-700 rounded-xl border border-haldi-500/20 text-sm">
              <strong className="block mb-1 font-ui">Disclaimer:</strong> 
              This is a standard template for informational purposes. Please consult with a legal professional to ensure these terms adequately protect your business.
            </div>

            <section>
              <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <Scale className="text-primary" size={24} />
                1. Acceptance of Terms
              </h2>
              <p className="mb-4">
                By accessing and using Vivahvedh (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by these terms, please do not use this Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="text-primary" size={24} />
                2. User Eligibility
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>You must be at least 18 years of age (or the legal marriageable age in your jurisdiction) to use this Service.</li>
                <li>You must be legally competent to enter into a matrimonial alliance.</li>
                <li>You agree to provide accurate, current, and complete information during the registration and KYC process.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="text-primary" size={24} />
                3. User Responsibilities
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>You are solely responsible for maintaining the confidentiality of your login credentials.</li>
                <li>You agree not to use the Service for any commercial purpose, dating, or any purpose other than finding a matrimonial match.</li>
                <li>You agree not to post or transmit any content that is offensive, defamatory, or violates the rights of others.</li>
                <li>You acknowledge that Vivahvedh is a platform facilitating connections and does not guarantee a successful match.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <ShieldAlert className="text-primary" size={24} />
                4. Content and Moderation
              </h2>
              <p className="mb-4">
                Vivahvedh reserves the right to review, edit, or delete any profile or content that violates these terms. 
                Accounts found to be providing false KYC documents, engaging in fraudulent behavior, or violating our policies may be suspended or permanently deleted without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-foreground mb-4">5. Payments and Subscriptions</h2>
              <p className="mb-4">
                Certain features of the Service require a paid subscription (e.g., SILVER or GOLD plans). 
                All payments are subject to verification. Refunds, if applicable, will be processed according to our refund policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-foreground mb-4">6. Limitation of Liability</h2>
              <p className="mb-4">
                Vivahvedh shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-foreground mb-4">7. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any significant changes. Your continued use of the Service following such modifications constitutes your acceptance of the revised terms.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
