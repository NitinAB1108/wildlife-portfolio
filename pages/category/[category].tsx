import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { dbConnect } from '../../lib/dbConnect';
import { Animal, IAnimal } from '../../models/Animal';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import MainLayout from '../../components/layouts/MainLayout';

interface CategoryPageProps {
  category: string;
  animals: IAnimal[];
}

const getCategoryDescription = (category: string) => {
  const descriptions = {
    Arthropods: "Explore the fascinating world of joint-legged invertebrates, from colorful butterflies to intricate spiders. These remarkable creatures make up the largest phylum in the animal kingdom.",
    Mollusks: "Discover the diverse group of soft-bodied invertebrates, including elegant shells, mysterious octopi, and colorful nudibranchs that inhabit our oceans and lands.",
    Worms: "Delve into the essential world of segmented and unsegmented worms, crucial players in ecosystem health and soil fertility.",
    Cnidarians: "Journey through the ethereal world of jellyfish, corals, and sea anemones, showcasing nature's mastery of simplistic beauty.",
    Echinoderms: "Witness the unique pentaradial symmetry of starfish, sea urchins, and their relatives in this collection of spiny-skinned marine animals.",
    Sponges: "Explore the ancient lineage of these simple yet crucial filter-feeding animals that help maintain ocean health.",
    Fish: "Dive into the underwater realm of scaled swimmers, from tiny reef dwellers to massive ocean wanderers.",
    Birds: "Soar through our collection of feathered friends, capturing their grace, color, and remarkable behaviors.",
    Reptiles: "Discover the fascinating world of scaled creatures, from swift lizards to patient tortoises.",
    Amphibians: "Experience the dual lives of these remarkable creatures that bridge water and land.",
    Mammals: "Meet our fellow warm-blooded animals, showcasing the diversity of fur-bearing creatures across the globe."
  };
  return descriptions[category as keyof typeof descriptions] || "Explore our collection of wildlife photography.";
};

const CategoryPage: React.FC<CategoryPageProps> = ({ category, animals }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const allImages = animals.flatMap(animal => 
      animal.imageDetails?.map(detail => ({
        path: detail.path,
        name: animal.name,
        id: animal._id
      })) || []
    );
  
    useEffect(() => {
      setIsLoaded(true);
    }, []);
  
    useEffect(() => {
      if (allImages.length > 0) {
        const interval = setInterval(() => {
          setCurrentSlideIndex((prev) => (prev + 1) % allImages.length);
        }, 5000);
        return () => clearInterval(interval);
      }
    }, [allImages.length]);
  
    return (
      <MainLayout>
        <div className={`min-h-screen -mt-[96px] transform-gpu transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
      {/* Hero Section with Slideshow */}
      <div className="relative h-[50vh] overflow-hidden">
        {allImages.length > 0 && (
          <>
            {allImages.map((image, index) => (
              <div
                key={`${image.id}-${index}`}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlideIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className={`w-full h-full transform transition-transform duration-[5000ms] ease-linear ${
                  index === currentSlideIndex ? 'scale-110' : 'scale-100'
                }`}>
                  <Image
                    src={image.path}
                    alt={image.name}
                    fill
                    className="object-cover blur-sm"
                  />
                </div>
              </div>
            ))}
            <div className="absolute inset-0 bg-black/50" />
          </>
        )}
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-6xl font-bold mb-6">{category}</h1>
          <p className="text-xl max-w-3xl text-center">
            {getCategoryDescription(category)}
          </p>
        </div>
      </div>

      {/* Animals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {animals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No animals documented in this category yet.</p>
          </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {animals.map((animal) => (
              <Link
                key={animal._id?.toString()}
                href={`/animal/${animal._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 sm:h-56">
                  {animal.imageDetails && animal.imageDetails[0] && (
                    <Image
                      src={animal.imageDetails[0].path}
                      alt={animal.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {animal.name}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">{animal.species}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    </MainLayout>
  );
};

export default CategoryPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const category = context.params?.category as string;
    await dbConnect();
    const animals = await Animal.find({ category }).lean();

    // Ensure imageDetails is always an array
    const processedAnimals = animals.map((animal) => ({
      ...animal,
      imageDetails: animal.imageDetails || [],
    }));

    return {
      props: {
        category,
        animals: JSON.parse(JSON.stringify(processedAnimals)),
      },
    };
  };