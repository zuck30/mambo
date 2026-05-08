import React from 'react';
import InfoLayout from '../../components/layout/InfoLayout';

const PrivacyPage = () => {
  return (
    <InfoLayout title="Privacy Policy">
      <div className="space-y-8 text-dark-text leading-relaxed">
        <p className="text-sm italic">Last Updated: May 20, 2024</p>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
          <p>
            Oa ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website. Oa operates globally, including in Africa, East Africa, and other international regions, and we comply with applicable data protection laws in these jurisdictions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
          <p>We collect information that you provide directly to us, such as when you create or modify your account, request customer support, or otherwise communicate with us. This may include:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Name, email address, and phone number.</li>
            <li>Profile photos and biographical information.</li>
            <li>Location data (with your permission).</li>
            <li>Messages and interactions with other users.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Provide, maintain, and improve our services.</li>
            <li>Facilitate matches and communications between users.</li>
            <li>Verify your identity and prevent fraud.</li>
            <li>Send you technical notices, updates, and security alerts.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. Global Data Transfers</h2>
          <p>
            As a global platform, your information may be transferred to and processed in countries other than your own. We ensure that such transfers are conducted in accordance with international data protection standards and that appropriate safeguards are in place.
          </p>
        </section>
      </div>
    </InfoLayout>
  );
};

export default PrivacyPage;
