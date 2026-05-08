import React from 'react';
import InfoLayout from '../../components/layout/InfoLayout';
import { Terminal, Cpu, Database, Code } from 'lucide-react';

const TechBlogPage = () => {
  return (
    <InfoLayout title="Tech Blog">
      <div className="space-y-12 text-dark-text leading-relaxed">
        <p className="text-lg">
          Insights from the engineering team behind Oa. We share our challenges, solutions, and the technologies that power our global dating platform.
        </p>

        <div className="space-y-8">
          <article className="group cursor-pointer">
            <div className="flex gap-4 items-start mb-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Database size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">Scaling Supabase for Millions of Users</h3>
                <p className="text-sm text-dark-text mb-2">May 15, 2024 • 8 min read</p>
                <p>Learn how we optimized our PostgreSQL schema and Row Level Security (RLS) policies to handle high-concurrency swiping and real-time messaging.</p>
              </div>
            </div>
            <div className="h-px bg-white/5 w-full mt-8" />
          </article>

          <article className="group cursor-pointer">
            <div className="flex gap-4 items-start mb-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Terminal size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">Building a High-Performance Swipe Engine</h3>
                <p className="text-sm text-dark-text mb-2">April 28, 2024 • 12 min read</p>
                <p>An in-depth look at using Framer Motion and custom React hooks to create a buttery-smooth swiping experience even on low-end devices.</p>
              </div>
            </div>
            <div className="h-px bg-white/5 w-full mt-8" />
          </article>

          <article className="group cursor-pointer">
            <div className="flex gap-4 items-start mb-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Cpu size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">AI-Driven Matchmaking in Emerging Markets</h3>
                <p className="text-sm text-dark-text mb-2">April 10, 2024 • 10 min read</p>
                <p>How we use machine learning to suggest relevant matches while accounting for cultural nuances and local preferences.</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </InfoLayout>
  );
};

export default TechBlogPage;
