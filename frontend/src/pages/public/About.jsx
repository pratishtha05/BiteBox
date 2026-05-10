import React from "react";
import { Link } from "react-router-dom";
import { Target, Eye, Zap, Heart, Award } from "lucide-react";

const About = () => {
  return (
    <div className="bg-white text-slate-900 font-sans antialiased overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-10 pb-16 md:pb-24 lg:pb-28 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6 md:space-y-8 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">
                Our Story
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95]">
              Reimagining <br />
              <span className="text-amber-500 italic font-serif">
                The Meal
              </span>{" "}
              Experience.
            </h1>

            <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
              BiteBox isn't just about delivery. We're building the digital
              bridge between world-class kitchens and your dining table, making
              food discovery as delightful as the first bite.
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8 pt-2 md:pt-4 flex-wrap">
              <div>
                <p className="text-2xl font-black">500+</p>
                <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Partners
                </p>
              </div>

              <div className="w-px h-10 bg-slate-100 hidden sm:block" />

              <div>
                <p className="text-2xl font-black">12k+</p>
                <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Daily Meals
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-2 sm:-inset-4 bg-amber-100/50 rounded-[2rem] sm:rounded-[3rem] -rotate-3" />

            <img
              src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1000&q=80"
              alt="High-end dining"
              className="relative w-full rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl z-10 hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
      </section>

      {/* MISSION & VISION: VALUE GRID */}
      <section className="bg-slate-50 py-14 md:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
            {/* Mission */}
            <div className="space-y-4 text-center sm:text-left">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-amber-500 border border-slate-100 mx-auto sm:mx-0">
                <Target size={24} />
              </div>

              <h3 className="text-xl font-black tracking-tight">
                Our Mission
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed">
                To empower local culinary talent by providing them with the
                tools to reach discerning food lovers, ensuring quality and
                convenience coexist.
              </p>
            </div>

            {/* Vision */}
            <div className="space-y-4 text-center sm:text-left">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-amber-500 border border-slate-100 mx-auto sm:mx-0">
                <Eye size={24} />
              </div>

              <h3 className="text-xl font-black tracking-tight">
                Our Vision
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed">
                A world where geographical boundaries don't limit your palate.
                We aim to be the global standard for flavor discovery.
              </p>
            </div>

            {/* Quality */}
            <div className="space-y-4 text-center sm:text-left sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-amber-500 border border-slate-100 mx-auto sm:mx-0">
                <Award size={24} />
              </div>

              <h3 className="text-xl font-black tracking-tight">
                Our Promise
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed">
                Every meal passed through BiteBox meets a rigorous standard of
                freshness, packaging quality, and rapid logistics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND VALUES */}
      <section className="py-16 md:py-24 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-slate-400 mb-10 md:mb-12">
          Why We Exist
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <div className="flex flex-col items-center gap-2">
            <Zap size={20} className="text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Instant
            </span>
          </div>

          <div className="h-px w-10 md:w-px md:h-8 bg-slate-200" />

          <div className="flex flex-col items-center gap-2">
            <Heart size={20} className="text-rose-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Curated
            </span>
          </div>

          <div className="h-px w-10 md:w-px md:h-8 bg-slate-200" />

          <div className="flex flex-col items-center gap-2">
            <Award size={20} className="text-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Premium
            </span>
          </div>

          <div className="h-px w-10 md:w-px md:h-8 bg-slate-200" />

          <div className="flex flex-col items-center gap-2">
            <Target size={20} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Reliable
            </span>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="relative mt-6 md:mt-10 px-4 sm:px-6 py-10 md:p-10 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-linear-to-br from-amber-400 via-amber-500 to-orange-500" />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />

        {/* Content */}
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Elevate Your <span className="text-white">Dining Experience</span>
          </h2>

          <p className="max-w-2xl mx-auto text-white/90 text-sm sm:text-base leading-relaxed px-2">
            Join BiteBox and explore a world of flavors crafted to delight every
            craving. Discover, savor, and celebrate food like never before.
          </p>

          {/* CTA */}
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/auth" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] sm:text-xs font-extrabold uppercase tracking-widest shadow-lg hover:bg-slate-800 hover:cursor-pointer transition-all active:scale-95">
                Get Started
              </button>
            </Link>

            <Link to="/" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-white/90 text-slate-900 rounded-2xl text-[10px] sm:text-xs font-extrabold uppercase tracking-widest hover:bg-white transition-all hover:cursor-pointer active:scale-95">
                Explore Food
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;