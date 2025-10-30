
import React from 'react';
import { VendorForm } from '../../components/VendorForm';

export const VendorsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-five16-mint">Partner With Us</h1>
        <p className="mt-4 text-lg text-gray-300">
          We collaborate with the best vendors to create exceptional events. If you're passionate about what you do and want to be a part of our curated network, please fill out the form below.
        </p>
      </div>
      <div className="mt-12">
        <VendorForm />
      </div>
    </div>
  );
};
