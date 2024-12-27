// pages/species/[species].tsx
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { dbConnect } from '../../lib/dbConnect';
import { Animal, IAnimal } from '../../models/Animal';

/** Species page component */
interface SpeciesPageProps {
  species: string;
  animals: IAnimal[];
}

const SpeciesPage: React.FC<SpeciesPageProps> = ({ species, animals }) => (
  <div>
    <h1>{species}</h1>
    <ul>
      {animals.map((animal) => (
        <li key={animal._id.toString()}>
          <Link href={`/animal/${animal._id.toString()}`}>{animal.name}</Link>
        </li>
      ))}
    </ul>
  </div>
);

export default SpeciesPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = context.params?.id as string;
    await dbConnect();
  
    const animal = await Animal.findById(id).lean();
  
    if (!animal) {
      return { notFound: true };
    }
  
    // Verify that imageDetails are present
    if (!animal.imageDetails || animal.imageDetails.length === 0) {
      animal.imageDetails = [];
    }
  
    return {
      props: {
        animal: JSON.parse(JSON.stringify(animal)),
      },
    };
  };