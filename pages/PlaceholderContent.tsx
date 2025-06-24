
import React from 'react';

interface PlaceholderContentProps {
  title: string;
  message?: string;
}

const PlaceholderContent: React.FC<PlaceholderContentProps> = ({ title, message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white p-8 rounded-xl shadow-lg text-center">
      <img src="https://picsum.photos/seed/placeholder/300/200" alt="Placeholder" className="rounded-lg mb-6 shadow-md" />
      <h2 className="text-3xl font-semibold text-gray-700 mb-3">{title}</h2>
      <p className="text-gray-500 max-w-md">
        {message || `Conteúdo para "${title}" será implementado em breve. Esta é uma área reservada para futuras funcionalidades do sistema.`}
      </p>
    </div>
  );
};

export default PlaceholderContent;
