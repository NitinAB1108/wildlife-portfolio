import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { dbConnect } from '../lib/dbConnect';
import { Animal, AnimalCategory } from '../models/Animal';
import MainLayout from '../components/layouts/MainLayout';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  
  // Debounced resize handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 150);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Memoize image processing
  const columnImages = useMemo(() => {
    const imagesPerColumn = isMobile ? 4 : 6;
    const speeds = [0.5, 0.75, 0.4, 0.6];

    return speeds.map((_, colIndex) => {
      const columnImages = allImages
        .filter((_, index) => index % 4 === colIndex)
        .slice(0, imagesPerColumn);
      
      // Shuffle images while avoiding duplicates
      const shuffled = [...columnImages];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        if (shuffled[i].id !== shuffled[j].id) {
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
      }
      return shuffled;
    });
  }, [allImages, isMobile]);

  // Memoize filtered categories
  const filteredCategories = useMemo(() => 
    categories.filter(category => counts[category] > 0),
    [categories, counts]
  );

  return (
    <MainLayout>
      <div className="min-h-screen -mt-[96px]">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="grid grid-cols-4 h-full">
              {columnImages.map((images, colIndex) => (
                <div key={colIndex} className="relative overflow-hidden">
                  <div 
                    className="animate-scroll will-change-transform"
                    style={{
                      animation: `scroll${colIndex % 2 === 0 ? 'Down' : 'Up'} ${isMobile ? 20/(colIndex * 0.25 + 0.5) : 30/(colIndex * 0.25 + 0.5)}s linear infinite`,
                    }}
                  >
                    {images.map((image, index) => (
                      <div
                        key={`${image.id}-${index}`}
                        className="relative h-[20vh] md:h-[35vh] w-full"
                      >
                        <Image
                          src={image.path}
                          alt={image.name}
                          fill
                          className="object-cover"
                          sizes="25vw"
                          quality={40}
                          loading={index < 2 ? "eager" : "lazy"}
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LC0yMi4xODY6OTg2MDQ0PkE9P0RHSktLS0xMTU1NTU1NTU3/2wBDAR4eHh0aHTQaGjRNMCUtTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        />
                        <div className="absolute inset-0 bg-black/20" />
                      </div>
                    ))}
                    {/* Duplicate images for seamless scrolling */}
                    {images.map((image, index) => (
                      <div
                        key={`${image.id}-${index}-duplicate`}
                        className="relative h-[20vh] md:h-[35vh] w-full"
                      >
                        <Image
                          src={image.path}
                          alt={image.name}
                          fill
                          className="object-cover"
                          sizes="25vw"
                          quality={40}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LC0yMi4xODY6OTg2MDQ0PkE9P0RHSktLS0xMTU1NTU1NTU3/2wBDAR4eHh0aHTQaGjRNMCUtTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        />
                        <div className="absolute inset-0 bg-black/20" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 backdrop-blur-sm bg-black/50" />
          </div>

          {/* Hero Section */}
          <div className="relative h-screen">
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-2 md:px-4">
              <h1 className="text-6xl sm:text-7xl md:text-9xl font-bold mb-3 md:mb-6 text-center">
                NABGRAPHY
              </h1>
              <p className="text-sm md:text-2xl max-w-3xl text-center">
                Explore the diverse world of wildlife through our carefully curated
                collection of animal photographs and information.
              </p>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <h2 className="text-4xl font-bold text-white mb-12 text-center">
                Explore Categories
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {filteredCategories.map((category) => (
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
                          priority={true}
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

    const animals = (await Animal.find({}, 'name category imageDetails').lean()) as unknown as AnimalDocument[];

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