import React from 'react';
import InfoLayout from '../../components/layout/InfoLayout';

const CookiePolicyPage = () => {
  return (
    <InfoLayout title="Cookie Policy">
      <div className="space-y-8 text-dark-text leading-relaxed">
        <p className="text-sm italic">Last Updated: May 20, 2024</p>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your device by websites that you visit. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">How We Use Cookies</h2>
          <p>We use cookies and similar tracking technologies for the following purposes:</p>
          <ul className="list-disc pl-6 mt-4 space-y-4">
            <li>
              <strong className="text-white">Authentication:</strong> To identify you when you visit our website or use our app, and to help you sign in.
            </li>
            <li>
              <strong className="text-white">Security:</strong> To protect your account and our services from unauthorized access and fraud.
            </li>
            <li>
              <strong className="text-white">Preferences:</strong> To remember your settings and preferences.
            </li>
            <li>
              <strong className="text-white">Analytics:</strong> To understand how you use our services so we can improve them.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Managing Cookies</h2>
          <p>
            Most web browsers allow some control of most cookies through the browser settings. However, if you use your browser settings to block all cookies (including essential cookies) you may not be able to access all or parts of our services.
          </p>
        </section>
      </div>
    </InfoLayout>
  );
};

export default CookiePolicyPage;
