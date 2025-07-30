import React from 'react';

const PlaceholderPage = ({ title }: { title: string }) => {
  return (
    <div className="container mx-auto mt-10 text-center">
      <h1 className="text-4xl font-bold mb-8">{title}</h1>
      <p className="text-lg text-gray-700">This page is under construction.</p>
    </div>
  );
};

export default PlaceholderPage;
