import React from 'react';
import InfoLayout from '../../components/layout/InfoLayout';

const LearnPage = () => {
  return (
    <InfoLayout title="Learn About Oa">
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4">How Oa Works</h2>
          <p className="text-dark-text leading-relaxed mb-4">
            Oa is more than just a dating app. It's a platform built on the principle of discovery. Whether you're looking for love, a new friend, or just a great conversation, Oa facilitates connections that matter.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-dark-text">
            <li>Create a profile that reflects your true self.</li>
            <li>Discover people nearby or around the world.</li>
            <li>Swipe right to like, left to pass.</li>
            <li>When both people swipe right, it's a match!</li>
            <li>Start a conversation and see where it goes.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Global Reach, Local Feel</h2>
          <p className="text-dark-text leading-relaxed">
            We operate internationally, with a strong focus on emerging markets in Africa and East Africa. Our platform is optimized to work across various network conditions and devices, ensuring everyone can participate in the global dating community.
          </p>
        </section>
      </div>
    </InfoLayout>
  );
};

export default LearnPage;
