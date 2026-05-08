import React from 'react';
import InfoLayout from '../../components/layout/InfoLayout';
import { Briefcase, Globe, Heart, Zap } from 'lucide-react';

const CareersPage = () => {
  return (
    <InfoLayout title="Careers at Oa">
      <div className="space-y-12 text-dark-text leading-relaxed">
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">Build the Future of Connection</h2>
          <p className="text-lg mb-8">
            Join a distributed team of innovators working to bring people together across continents. At Oa, we believe that love and friendship have no borders.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-dark-card p-6 rounded-2xl border border-white/5">
              <Globe className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Remote-First</h3>
              <p className="text-sm">We are a fully remote team with hubs in Nairobi, London, and New York.</p>
            </div>
            <div className="bg-dark-card p-6 rounded-2xl border border-white/5">
              <Heart className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Inclusive Culture</h3>
              <p className="text-sm">Diversity is our strength. We welcome talent from all backgrounds and cultures.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Open Roles</h2>
          <div className="space-y-4">
            {[
              { title: 'Senior Full Stack Engineer', location: 'Remote (Africa / Europe)', type: 'Full-time' },
              { title: 'Product Designer', location: 'Remote (Anywhere)', type: 'Full-time' },
              { title: 'Data Scientist', location: 'Remote (US / Europe)', type: 'Full-time' },
              { title: 'Customer Success Manager', location: 'Nairobi / Remote', type: 'Full-time' }
            ].map((role, i) => (
              <div key={i} className="flex justify-between items-center p-4 border border-white/10 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                <div>
                  <h4 className="font-bold text-white">{role.title}</h4>
                  <p className="text-sm">{role.location}</p>
                </div>
                <span className="text-xs font-medium text-primary px-3 py-1 bg-primary/10 rounded-full">{role.type}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </InfoLayout>
  );
};

export default CareersPage;
