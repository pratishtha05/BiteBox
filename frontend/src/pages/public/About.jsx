import React from "react";
import { Link } from "react-router-dom";
import { Target, Eye, Zap, Heart, Award } from "lucide-react";

const About = () => {
  return (
    <div className="bg-white text-slate-900 font-sans antialiased">
      {/* HERO SECTION */}
      <section className="relative pt-10 pb-28 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">Our Story</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[0.9]">
              Reimagining <br />
              <span className="text-amber-500 italic font-serif">The Meal</span> Experience.
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
              BiteBox isn't just about delivery. We're building the digital bridge between 
              world-class kitchens and your dining table, making food discovery 
              as delightful as the first bite.
            </p>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-2xl font-black">500+</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Partners</p>
              </div>
              <div className="w-px h-10 bg-slate-100" />
              <div>
                <p className="text-2xl font-black">12k+</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Daily Meals</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-4 bg-amber-100/50 rounded-[3rem] -rotate-3" />
            <img
              src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1000&q=80"
              alt="High-end dining"
              className="relative rounded-[2.5rem] shadow-2xl z-10 hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
      </section>

      {/* MISSION & VISION: VALUE GRID */}
      <section className="bg-slate-50 py-15 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Mission */}
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-amber-500 border border-slate-100">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-black tracking-tight">Our Mission</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                To empower local culinary talent by providing them with the tools to reach 
                discerning food lovers, ensuring quality and convenience coexist.
              </p>
            </div>

            {/* Vision */}
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-amber-500 border border-slate-100">
                <Eye size={24} />
              </div>
              <h3 className="text-xl font-black tracking-tight">Our Vision</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                A world where geographical boundaries don't limit your palate. We aim to 
                be the global standard for flavor discovery.
              </p>
            </div>

            {/* Quality */}
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-amber-500 border border-slate-100">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-black tracking-tight">Our Promise</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Every meal passed through BiteBox meets a rigorous standard of freshness, 
                packaging quality, and rapid logistics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND VALUES */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-12">Why We Exist</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-16">
           <div className="flex flex-col items-center gap-2 ">
             <Zap size={20} className="text-amber-500" />
             <span className="text-[10px] font-black uppercase tracking-widest">Instant</span>
           </div>
           <div className="w-px h-8 bg-slate-200 mx-auto md:mx-0" />
           <div className="flex flex-col items-center gap-2">
             <Heart size={20} className="text-rose-500" />
             <span className="text-[10px] font-black uppercase tracking-widest">Curated</span>
           </div>
           <div className="w-px h-8 bg-slate-200 mx-auto md:mx-0" />
           <div className="flex flex-col items-center gap-2">
             <Award size={20} className="text-indigo-500" />
             <span className="text-[10px] font-black uppercase tracking-widest">Premium</span>
           </div>
           <div className="w-px h-8 bg-slate-200 mx-auto md:mx-0" />
           <div className="flex flex-col items-center gap-2">
             <Target size={20} className="text-emerald-500" />
             <span className="text-[10px] font-black uppercase tracking-widest">Reliable</span>
           </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="pb-20 px-6 mt-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Ready to Elevate Your Dining Experience?
          </h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Join BiteBox today and embark on a culinary journey that transcends
            boundaries. Discover, savor, and celebrate food like never before.
          </p>
          <Link to="/auth">
            <button className="px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-600 transition-all active:scale-95 cursor-pointer">
              Get Started
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;