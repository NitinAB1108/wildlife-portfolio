import { z } from "zod";

const AnimalCategories = [
  'Arthropods', 'Mollusks', 'Worms', 'Cnidarians', 
  'Echinoderms', 'Sponges', 'Fish', 'Birds', 
  'Reptiles', 'Amphibians', 'Mammals'
] as const;

export const AnimalSchema = z.object({
  name: z.string(),
  species: z.string(),
  category: z.enum(AnimalCategories),
  description: z.string(),
});

export type AnimalDetails = z.infer<typeof AnimalSchema>;