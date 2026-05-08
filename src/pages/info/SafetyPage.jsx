import React from 'react';
import InfoLayout from '../../components/layout/InfoLayout';
import { Shield, Lock, Eye, AlertTriangle } from 'lucide-react';

const SafetyPage = () => {
  return (
    <InfoLayout title="Safety Center">
      <div className="space-y-12">
        <p className="text-xl text-dark-text italic border-l-4 border-primary pl-6 py-2">
          Your safety is our top priority. We are committed to making Oa the safest place to meet new people.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-dark-card p-6 rounded-2xl border border-white/5">
            <Shield className="text-primary mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Member Verification</h3>
            <p className="text-dark-text text-sm">
              We use advanced AI and human moderation to verify profiles and keep bots and scammers off the platform.
            </p>
          </div>
          <div className="bg-dark-card p-6 rounded-2xl border border-white/5">
            <Lock className="text-primary mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Data Privacy</h3>
            <p className="text-dark-text text-sm">
              Your personal information is encrypted and protected. You control what you share and who you share it with.
            </p>
          </div>
          <div className="bg-dark-card p-6 rounded-2xl border border-white/5">
            <Eye className="text-primary mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Reporting</h3>
            <p className="text-dark-text text-sm">
              Easy-to-use reporting tools allow you to alert our safety team of any inappropriate behavior instantly.
            </p>
          </div>
          <div className="bg-dark-card p-6 rounded-2xl border border-white/5">
            <AlertTriangle className="text-primary mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Safety Tips</h3>
            <p className="text-dark-text text-sm">
              Comprehensive guides on how to stay safe both online and when meeting in person.
            </p>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4">Meeting Safely in Person</h2>
          <ul className="space-y-4 text-dark-text">
            <li className="flex gap-4">
              <span className="text-primary font-bold">01.</span>
              <span>Always meet in a public place.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-primary font-bold">02.</span>
              <span>Tell a friend or family member about your plans.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-primary font-bold">03.</span>
              <span>Stay in control of your transportation.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-primary font-bold">04.</span>
              <span>Trust your instincts. If something feels wrong, leave.</span>
            </li>
          </ul>
        </section>
      </div>
    </InfoLayout>
  );
};

export default SafetyPage;
