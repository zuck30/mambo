import React from 'react';
import InfoLayout from '../../components/layout/InfoLayout';

const ProductsPage = () => {
  return (
    <InfoLayout title="Our Products">
      <section className="space-y-8">
        <div className="bg-dark-card p-8 rounded-2xl border border-white/5">
          <h2 className="text-2xl font-bold mb-4 text-primary">Oa Core</h2>
          <p className="text-dark-text leading-relaxed">
            Our flagship dating experience, designed for meaningful connections. With a global reach spanning from New York to Nairobi, Oa Core brings people together based on shared interests, values, and location.
          </p>
        </div>

        <div className="bg-dark-card p-8 rounded-2xl border border-white/5">
          <h2 className="text-2xl font-bold mb-4 text-primary">Oa Gold</h2>
          <p className="text-dark-text leading-relaxed">
            Elevate your experience with premium features including unlimited likes, see who likes you, and passport mode to connect with people anywhere in the world.
          </p>
        </div>

        <div className="bg-dark-card p-8 rounded-2xl border border-white/5">
          <h2 className="text-2xl font-bold mb-4 text-primary">Oa Platinum</h2>
          <p className="text-dark-text leading-relaxed">
            The ultimate Oa experience. Priority likes, message before matching, and all the benefits of Gold. Designed for those serious about finding their perfect match.
          </p>
        </div>
      </section>
    </InfoLayout>
  );
};

export default ProductsPage;
