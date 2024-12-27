import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../../lib/dbConnect';
import { Animal } from '../../models/Animal';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import { getAnimalDetails } from '../../utils/openai';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      multiples: true,
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const species = Array.isArray(fields.species) ? fields.species[0] : fields.species;
    const location = Array.isArray(fields.location) ? fields.location[0] : fields.location;
    const fileArray = Array.isArray(files.images) ? files.images : [files.images];

    // Correctly construct imagePaths using newFilename
    const imagePaths = fileArray.map((file) => `/uploads/${file.newFilename}`);

    // Get details for first image to determine category
    const firstImageDetails = await getAnimalDetails(imagePaths[0], name, species);

    if (!firstImageDetails || !firstImageDetails.category) {
      throw new Error('Failed to get animal category from OpenAI');
    }

    // Get details for all images
    const imageDetails = await Promise.all(
      imagePaths.map(async (path) => {
        const details = await getAnimalDetails(path, name, species);
        if (!details) {
          throw new Error('Failed to get image details from OpenAI');
        }
        return {
          path,
          species: details.species || species || 'Unknown Species',
          description: details.description || 'No description available.',
        };
      })
    );

    const existingAnimal = await Animal.findOne({ name });

    if (existingAnimal) {
      existingAnimal.imageDetails.push(...imageDetails);
      existingAnimal.images.push(...imagePaths);

      // Update species and description if they're not already set
      if (!existingAnimal.species) {
        existingAnimal.species = species || firstImageDetails.species;
      }

      if (!existingAnimal.description) {
        existingAnimal.description = firstImageDetails.description;
      }

      await existingAnimal.save();
      return res.status(200).json({ success: true });
    }

    // Create new animal with all required fields
    const animal = new Animal({
      name,
      species: species || firstImageDetails.species,
      description: firstImageDetails.description,
      category: firstImageDetails.category,
      imageDetails,
      images: imagePaths,
      location,
    });

    await animal.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      message: 'Error uploading files',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}