import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { AnimalSchema } from './types';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type AnimalDetails = z.infer<typeof AnimalSchema>;

/** Function to get animal details using OpenAI */
export async function getAnimalDetails(imagePath: string, animalName: string, species: string): Promise<AnimalDetails> {
    const system_prompt = `You are an AI that provides fun animal details based on images. 
    Categorize the animal into one of these categories: Arthropods, Mollusks, Worms, 
    Cnidarians, Echinoderms, Sponges, Fish, Birds, Reptiles, Amphibians, Mammals. Try to generate interesting and fun facts. Keep your language exciting and upbeat.`;
  
    const user_prompt = `Provide detailed information about this ${animalName}. Scientific Name: ${species}.
    Include its scientific species name and which category it belongs to from the list provided.`;

    try {
        const completion = await openai.beta.chat.completions.parse({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: system_prompt },
            { role: 'user', content: user_prompt },
          ],
          response_format: zodResponseFormat(AnimalSchema, "animal"),
        });
    
        const parsed = completion.choices[0].message.parsed;
        if (!parsed) {
          throw new Error('Failed to parse animal details from OpenAI response');
        }
    
        return parsed;
      } catch (error) {
        console.error('OpenAI API error:', error);
        throw new Error('Failed to get animal details from OpenAI');
      }
    }