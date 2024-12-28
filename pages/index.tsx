import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { dbConnect } from '../lib/dbConnect';
import { Animal, AnimalCategory } from '../models/Animal';
import MainLayout from '../components/layouts/MainLayout';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Types } from 'mongoose';

interface HomeProps {
  categories: AnimalCategory[];
  counts: Record<AnimalCategory, number>;
  allImages: Array<{
    path: string;
    name: string;
    id: string;
    category: string;
  }>;
}

interface AnimalDocument {
  _id: Types.ObjectId;
  name: string;
  category: string;
  imageDetails?: Array<{
    path: string;
    species: string;
    description: string;
  }>;
  __v?: number;
}

const getCategoryImage = (category: string) => {
  const images = {
    Arthropods: '/category-images/arthropods.jpg',
    Mollusks: '/category-images/mollusks.jpg',
    Worms: '/category-images/worms.jpg',
    Cnidarians: '/category-images/cnidarians.jpg',
    Echinoderms: '/category-images/echinoderms.jpg',
    Sponges: '/category-images/sponges.jpg',
    Fish: '/category-images/fish.jpg',
    Birds: '/category-images/birds.jpg',
    Reptiles: '/category-images/reptiles.jpg',
    Amphibians: '/category-images/amphibians.jpg',
    Mammals: '/category-images/mammals.jpg',
  };
  return images[category as keyof typeof images] || '/category-images/default.jpg';
};

const defaultCounts: Record<AnimalCategory, number> = {
  Arthropods: 0,
  Mollusks: 0,
  Worms: 0,
  Cnidarians: 0,
  Echinoderms: 0,
  Sponges: 0,
  Fish: 0,
  Birds: 0,
  Reptiles: 0,
  Amphibians: 0,
  Mammals: 0,
};

const Home = ({ categories = [], counts = defaultCounts, allImages = [] }: HomeProps) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (allImages?.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % allImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [allImages]);

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Hero Section with Slideshow */}
        <div className="relative h-[70vh] overflow-hidden">
          {allImages?.length > 0 && (
            <>
              {allImages.map((image, index) => (
                <div
                  key={`${image.id}-${index}`}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlideIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div
                    className={`w-full h-full transform transition-transform duration-[5000ms] ease-linear ${
                      index === currentSlideIndex ? 'scale-110' : 'scale-100'
                    }`}
                  >
                    <Image
                      src={image.path}
                      alt={image.name}
                      fill
                      className="object-cover blur-sm"
                      priority={index === 0}
                    />
                  </div>
                </div>
              ))}
              <div className="absolute inset-0 bg-black/50" />
            </>
          )}

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
            <h1 className="text-7xl font-bold mb-6 text-center">
              Wildlife Portfolio
            </h1>
            <p className="text-2xl max-w-3xl text-center">
              Explore the diverse world of wildlife through our carefully curated
              collection of animal photographs and information.
            </p>
            {/* {currentImage && (
              <p className="text-lg mt-4 opacity-75">
                Currently viewing: {currentImage.name} ({currentImage.category})
              </p>
            )} */}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Explore Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {categories.filter(category => counts[category] > 0).map((category) => (
            <div
              key={category}
              className="transform-gpu transition-all duration-500 hover:scale-[1.02]"
            >
              <Link
                href={`/category/${encodeURIComponent(category)}`}
                className="group block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl"
              >
                <div 
                  className="relative h-48 sm:h-56 lg:h-64 transform-gpu transition-transform duration-700 ease-out group-hover:scale-105"
                >
                  <Image
                    src={getCategoryImage(category)}
                    alt={category}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 transform-gpu transition-all duration-500 group-hover:translate-y-[-4px]">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-white group-hover:translate-x-2 transition-transform duration-300">
                    {category}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-200 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                    <span>{counts[category]} species documented</span>
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        </div>
      </div>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    await dbConnect();
    const categories: AnimalCategory[] = [
      'Arthropods',
      'Mollusks',
      'Worms',
      'Cnidarians',
      'Echinoderms',
      'Sponges',
      'Fish',
      'Birds',
      'Reptiles',
      'Amphibians',
      'Mammals',
    ];

    const animals = (await Animal.find({}).lean()) as unknown as AnimalDocument[];

    const counts = categories.reduce(
      (acc, category) => ({
        ...acc,
        [category]: animals.filter((animal: AnimalDocument) => animal.category === category).length,
      }),
      {} as Record<AnimalCategory, number>
    );

    const allImages = animals.flatMap((animal: AnimalDocument) =>
      (animal.imageDetails || []).map((detail: { path: string }) => ({
        path: detail.path,
        name: animal.name,
        id: animal._id.toString(),
        category: animal.category,
      }))
    );

    // Shuffle the images array for random slideshow order
    const shuffledImages = [...allImages].sort(() => Math.random() - 0.5);

    return {
      props: {
        categories,
        counts,
        allImages: JSON.parse(JSON.stringify(shuffledImages)),
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        categories: [],
        counts: {},
        allImages: [],
      },
    };
  }
};

export default Home;