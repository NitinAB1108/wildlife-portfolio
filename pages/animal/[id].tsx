import { GetServerSideProps } from 'next';
import { dbConnect } from '../../lib/dbConnect';
import { Animal, IAnimal } from '../../models/Animal';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import MainLayout from '../../components/layouts/MainLayout';

interface AnimalPageProps {
  animal: IAnimal;
}

const AnimalPage: React.FC<AnimalPageProps> = ({ animal }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!animal.imageDetails || animal.imageDetails.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-50 flex items-center justify-center">
        <p className="text-xl text-gray-700">No images available for this animal.</p>
      </div>
    );
  }

  const currentImage = animal.imageDetails[currentIndex];
  
  return (
    <MainLayout>
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Main Carousel Section */}
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative w-full h-[600px] overflow-hidden group">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  width: `${animal.imageDetails.length * 50}%`,
                }}
              >
                {animal.imageDetails.map((imgDetail, idx) => (
                  <div
                    key={idx}
                    className="w-full flex-shrink-0"
                  >
                    <div className="relative w-full h-[600px]">
                      <Image
                        src={imgDetail.path}
                        alt={`${animal.name} ${idx + 1}`}
                        fill
                        className="object-contain object-center"
                        sizes="(max-width: 1280px) 100vw, 1024px"
                        priority={idx === 0}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Controls */}
              <button
                onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => setCurrentIndex((prev) => (prev < animal.imageDetails.length - 1 ? prev + 1 : prev))}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {animal.imageDetails.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Details Section */}
          <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              {animal.name}
            </h1>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <h2 className="text-sm font-medium text-gray-500">Category</h2>
                <p className="text-lg text-gray-900">{animal.category}</p>
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-medium text-gray-500">Species</h2>
                <p className="text-lg text-gray-900">{currentImage.species}</p>
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-medium text-gray-500">Location</h2>
                <p className="text-lg text-gray-900">{animal.location}</p>
              </div>

              <div className="md:col-span-2 space-y-2">
                <h2 className="text-sm font-medium text-gray-500">Description</h2>
                <p className="text-lg text-gray-900">{currentImage.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  );
};

export default AnimalPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id as string;
  await dbConnect();
  
  const animal = await Animal.findById(id).lean();

  if (!animal) {
    return { notFound: true };
  }

  if (!animal.imageDetails || !animal.imageDetails.length) {
    animal.imageDetails = [];
  }

  return { 
    props: { 
      animal: JSON.parse(JSON.stringify(animal))
    } 
  };
};