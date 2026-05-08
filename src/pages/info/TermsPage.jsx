import React from 'react';
import InfoLayout from '../../components/layout/InfoLayout';

const TermsPage = () => {
  return (
    <InfoLayout title="Terms of Service">
      <div className="space-y-8 text-dark-text leading-relaxed">
        <p className="text-sm italic">Last Updated: May 20, 2024</p>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
          <p>
            By creating an Oa account, whether through a mobile device, mobile application, or computer, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you should not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. Eligibility</h2>
          <p>
            You must be at least 18 years of age to create an account on Oa and use the Service. By creating an account and using the Service, you represent and warrant that you can form a binding contract with Oa.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Global Usage</h2>
          <p>
            Oa is intended for a global audience. You are responsible for complying with the local laws of your jurisdiction while using Oa. This includes compliance with all local rules regarding online conduct and acceptable content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. Prohibited Content</h2>
          <p>You agree not to post content that:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Is offensive, abusive, or promotes discrimination.</li>
            <li>Contains sexually explicit content or pornography.</li>
            <li>Is intended to harass, threaten, or intimidate any other user.</li>
            <li>Is illegal or promotes illegal activities.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your account at any time, without notice, for conduct that we believe violates these Terms or is harmful to other users of the Service, us, or third parties, or for any other reason.
          </p>
        </section>
      </div>
    </InfoLayout>
  );
};

export default TermsPage;
