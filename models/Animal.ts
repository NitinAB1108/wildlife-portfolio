import mongoose, { Document, Schema } from 'mongoose';

export type AnimalCategory = 
  | 'Arthropods' | 'Mollusks' | 'Worms' | 'Cnidarians' 
  | 'Echinoderms' | 'Sponges' | 'Fish' | 'Birds' 
  | 'Reptiles' | 'Amphibians' | 'Mammals';

interface ImageDetails {
  path: string;
  species: string;
  description: string;
}

export interface IAnimal extends Document {
  name: string;
  species: string;
  description: string;
  category: AnimalCategory;
  imageDetails: ImageDetails[];
  images: string[];  // Add this for backward compatibility
  location: string;
}

const ImageDetailsSchema = new Schema({
  path: { type: String, required: true },
  species: { type: String, required: true },
  description: { type: String, required: true },
});

const AnimalSchema: Schema = new Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      'Arthropods', 'Mollusks', 'Worms', 'Cnidarians',
      'Echinoderms', 'Sponges', 'Fish', 'Birds',
      'Reptiles', 'Amphibians', 'Mammals',
    ],
  },
  imageDetails: { type: [ImageDetailsSchema], default: [] }, // Set default to empty array
  images: { type: [String], default: [] },
  location: { type: String, required: true },
});
export const Animal = mongoose.models.Animal || mongoose.model<IAnimal>('Animal', AnimalSchema);