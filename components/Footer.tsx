
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-6 border-t border-gray-200">
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} Cisco-Huawei Converter. Built with React + Tailwind CSS
      </p>
    </footer>
  );
};

export default Footer;
