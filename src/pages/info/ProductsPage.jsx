import React from 'react';
import { Crown, Sparkles, Star, Diamond } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductsPage = () => {
  const products = [
    {
      icon: Sparkles,
      name: "Oa Core",
      color: "from-[#ff79ac] to-[#ff4d8c]",
      description: "Our flagship dating experience, designed for meaningful connections. With a global reach spanning. Oa Core brings people together based on shared interests, values, and location.",
      features: ["Global Reach", "Smart Matching", "Real Connections"]
    },
    {
      icon: Star,
      name: "Oa Gold",
      color: "from-amber-500 to-yellow-500",
      description: "Elevate your experience with premium features including unlimited likes, see who likes you, and passport mode to connect with people anywhere in the world.",
      features: ["Unlimited Likes", "See Who Likes You", "Passport Mode"]
    },
    {
      icon: Diamond,
      name: "Oa Platinum",
      color: "from-cyan-500 to-blue-500",
      description: "The ultimate Oa experience. Priority likes, message before matching, and all the benefits of Gold. Designed for those serious about finding their perfect match.",
      features: ["Priority Likes", "Message Before Match", "All Gold Benefits"]
    }
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Decorative Crown Watermarks */}
      <div className="absolute -right-20 -top-20 opacity-[0.03] pointer-events-none">
        <Crown size={350} />
      </div>
      <div className="absolute -left-20 -bottom-20 opacity-[0.03] pointer-events-none">
        <Crown size={300} />
      </div>
      
      {/* Subtle gradient orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#ff79ac]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#ff79ac]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-[#ff79ac] to-[#ff4d8c] p-2 rounded-xl">
            <Crown size={24} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">Products</span>
        </div>
        <button
          onClick={() => window.history.back()}
          className="text-white/60 hover:text-white transition-colors text-sm font-medium"
        >
          ← Back
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 text-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Our <span className="bg-gradient-to-r from-[#ff79ac] to-[#ff4d8c] bg-clip-text text-transparent">Products</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Choose the experience that's right for you
          </p>
        </motion.div>
      </section>

      {/* Products Grid */}
      <main className="relative z-10 flex-grow max-w-6xl mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300"
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative p-8">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${product.color} p-3 mb-6 shadow-lg`}>
                    <Icon size={40} className="text-white" />
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-2xl font-bold mb-3 text-white">
                    {product.name}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-white/60 text-sm leading-relaxed mb-6">
                    {product.description}
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-2">
                    {product.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-white/40 text-xs">
                        <div className="w-1 h-1 rounded-full bg-[#ff79ac]" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Decorative crown in card */}
                  <div className="absolute -bottom-6 -right-6 opacity-[0.03] pointer-events-none">
                    <Crown size={80} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black/50 border-t border-white/10 py-8 px-6 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Oa Group, LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProductsPage;