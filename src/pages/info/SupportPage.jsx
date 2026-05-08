import React from 'react';
import InfoLayout from '../../components/layout/InfoLayout';
import { HelpCircle, MessageSquare, Mail, Phone } from 'lucide-react';

const SupportPage = () => {
  return (
    <InfoLayout title="Help & Support">
      <div className="space-y-12">
        <section className="grid md:grid-cols-2 gap-6">
          <div className="border border-white/10 p-8 rounded-2xl hover:border-primary/50 transition-colors cursor-pointer group">
            <HelpCircle className="text-primary mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-xl font-bold mb-2">Help Center</h3>
            <p className="text-dark-text text-sm">Browse our comprehensive guides and FAQs for quick answers.</p>
          </div>
          <div className="border border-white/10 p-8 rounded-2xl hover:border-primary/50 transition-colors cursor-pointer group">
            <MessageSquare className="text-primary mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-xl font-bold mb-2">Live Chat</h3>
            <p className="text-dark-text text-sm">Speak with our support team in real-time (Available 24/7).</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-dark-text">
              <Mail className="text-primary" size={20} />
              <span>support@oa.com</span>
            </div>
            <div className="flex items-center gap-4 text-dark-text">
              <Phone className="text-primary" size={20} />
              <span>+1 (514) 900 1475</span>
            </div>
          </div>
        </section>

        <section className="bg-dark-card p-8 rounded-2xl border border-white/5">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-white mb-2">How do I reset my password?</h4>
              <p className="text-dark-text text-sm">Since we use email OTP (One-Time Password) for login, you don't need a traditional password. Simply enter your email and we'll send you a new code every time.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">How can I delete my account?</h4>
              <p className="text-dark-text text-sm">You can delete your account from the Settings menu within the app. Please note that this action is permanent.</p>
            </div>
          </div>
        </section>
      </div>
    </InfoLayout>
  );
};

export default SupportPage;
