import { GetServerSideProps } from 'next';
import { dbConnect } from '../../lib/dbConnect';
import { Animal, IAnimal } from '../../models/Animal';
import Image from 'next/image';
import { useState } from 'react';
import MainLayout from '../../components/layouts/MainLayout';

interface AnimalPageProps {
  animal: IAnimal;
}

const AnimalPage: React.FC<AnimalPageProps> = ({ animal }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!animal.imageDetails || animal.imageDetails.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <p className="text-xl text-gray-300">No images available for this animal.</p>
      </div>
    );
  }

  const currentImage = animal.imageDetails[currentIndex];
  
  return (
    <MainLayout>
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Carousel Section */}
        <div className="w-full max-w-4xl mx-auto">
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group">
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                width: `${animal.imageDetails.length === 1 ? 100 : animal.imageDetails.length * 50}%`,
                }}
            >
                {animal.imageDetails.map((imgDetail, idx) => (
                <div
                    key={idx}
                    className="w-full flex-shrink-0"
                >
                    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
                    <Image
                        src={imgDetail.path}
                        alt={`${animal.name} ${idx + 1}`}
                        fill
                        className="object-contain object-center"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 1024px"
                        priority={idx === 0}
                    />
                    </div>
                </div>
                ))}
            </div>
            
            {/* Navigation Controls */}
            <button
            onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
            aria-label="Previous image"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            </button>

            <button
            onClick={() => setCurrentIndex((prev) => (prev < animal.imageDetails.length - 1 ? prev + 1 : prev))}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
            aria-label="Next image"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            </button>
        </div>
        </div>
          </div>
          
          {/* Details Section */}
          <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
              {animal.name}
            </h1>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <h2 className="text-sm font-medium text-gray-400">Category</h2>
                <p className="text-lg text-gray-200">{animal.category}</p>
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-medium text-gray-400">Species</h2>
                <p className="text-lg text-gray-200">{currentImage.species}</p>
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-medium text-gray-400">Location</h2>
                <p className="text-lg text-gray-200">{animal.location}</p>
              </div>

              <div className="md:col-span-2 space-y-2">
                <h2 className="text-sm font-medium text-gray-400">Description</h2>
                <p className="text-lg text-gray-200">{currentImage.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AnimalPage;

import { Types, Document } from 'mongoose'; // Add Document to the import

// Update the interface to match Mongoose's document structure
interface AnimalLeanDoc extends Document {
  _id: Types.ObjectId;
  name: string;
  category: string;
  location: string;
  imageDetails?: Array<{
    path: string;
    species: string;
    description: string;
  }>;
  __v: number;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = context.params?.id as string;
    await dbConnect();
    
    // Use type assertion with unknown first
    const animal = (await Animal.findById(id).lean()) as unknown as AnimalLeanDoc;

    if (!animal) {
      return { notFound: true };
    }
    
    const processedAnimal = {
      ...animal,
      imageDetails: animal.imageDetails || [],
      _id: animal._id.toString()
    };
  
    return { 
      props: { 
        animal: JSON.parse(JSON.stringify(processedAnimal))
      } 
    };
};