// About.jsx
import React from "react";

const About = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="bg-amber-50 rounded-xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-6">
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            About <span className="text-amber-500">BiteBox</span>
          </h1>
          <p className="text-gray-700">
            BiteBox is your go-to platform for discovering top-rated restaurants, exclusive deals, and fresh meals delivered to your doorstep. We make food discovery simple, fast, and delightful.
          </p>
          <p className="text-gray-700">
            From busy weekdays to special occasions, BiteBox ensures you enjoy delicious food anytime, anywhere.
          </p>
        </div>
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80"
            alt="Delicious food"
            className="rounded-xl shadow-md w-full object-cover"
          />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h2>
          <p className="text-gray-700">
            Connect food lovers with the best local restaurants, providing convenience, quality, and unbeatable deals.
          </p>
        </div>
        <div className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Our Vision</h2>
          <p className="text-gray-700">
            Be the most trusted and beloved food discovery platform, delighting every customer with amazing meals and experiences.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <p className="text-gray-700 mb-4">
          Hungry? Explore the best deals near you!
        </p>
        <a
          href="/deals"
          className="inline-block bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition hover:cursor-pointer active:scale-95"
        >
          View Today's Deals
        </a>
      </section>
    </div>
  );
};

export default About;
