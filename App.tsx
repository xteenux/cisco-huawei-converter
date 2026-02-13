
import React from 'react';
import Header from './components/Header';
import Converter from './components/Converter';
import FeatureCards from './components/FeatureCards';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Converter />
        <FeatureCards />
      </main>
      <Footer />
    </div>
  );
};

export default App;
