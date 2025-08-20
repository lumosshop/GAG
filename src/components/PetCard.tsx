import React from 'react';
import { Pet } from '../types/Pet';

interface PetCardProps {
  pet: Pet;
  isSelected: boolean;
  onSelect: (pet: Pet) => void;
  disabled: boolean;
  stock: number;
}

export const PetCard: React.FC<PetCardProps> = ({ pet, isSelected, onSelect, disabled, stock }) => {
  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-lg
        ${isSelected ? 'ring-4 ring-blue-400 ring-opacity-75 shadow-lg' : ''}
        ${disabled && !isSelected && stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}
        ${disabled && !isSelected && stock > 0 ? 'opacity-60 cursor-not-allowed' : ''}
      `}
      onClick={() => !disabled && onSelect(pet)}
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors">
        <div className="aspect-square bg-gray-100 flex items-center justify-center relative p-4" style={{backgroundImage: 'url(https://i.postimg.cc/kg167YXG/Chat-GPT-Image-Aug-9-2025-10-03-51-PM.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <img 
            src={pet.image} 
            alt={pet.name}
            className={`w-full h-full object-contain relative z-10 ${pet.id === 'spinosaurus' ? 'translate-x-2' : ''}`}
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const placeholder = target.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
            <span className="text-white font-bold text-2xl">
              {pet.name.charAt(0)}
            </span>
          </div>
          {isSelected && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-2 bg-white">
          <h3 className="text-xs font-bold text-gray-800 text-center leading-tight">
            {pet.name}
          </h3>
        </div>
      </div>
      {/* Stock indicator - green circle sticker */}
      {stock > 0 && (
        <div className="absolute top-2 left-2 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white px-2 py-1 z-20">
          <span className="text-white font-bold text-xs whitespace-nowrap">
            ({stock}) in stock
          </span>
        </div>
      )}
      {/* Out of stock overlay */}
      {disabled && !isSelected && stock === 0 && (
        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center z-20">
          <span className="text-red-400 font-bold text-sm transform -rotate-12 bg-black/80 px-3 py-1 rounded border-2 border-red-400">
            OUT OF STOCK
          </span>
        </div>
      )}
    </div>
  );
};