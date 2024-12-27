import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../../lib/dbConnect';
import { Animal } from '../../models/Animal';
import formidable from 'formidable';
import { uploadToBlob } from '../../utils/blobStorage';
import { getAnimalDetails } from '../../utils/openai';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function bufferToBlob(file: formidable.File): Promise<string> {
  try {
    const data = await fs.readFile(file.filepath);
    return uploadToBlob(data, file.originalFilename || 'unnamed');
  } catch (error) {
    console.error('Error reading file:', error);
    throw new Error('Failed to process file');
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const form = formidable({
      multiples: true,
      keepExtensions: true,
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const species = Array.isArray(fields.species) ? fields.species[0] : fields.species;
    const location = Array.isArray(fields.location) ? fields.location[0] : fields.location;
    const fileArray = Array.isArray(files.images) ? files.images : [files.images];

    if (!fileArray || !fileArray[0]) {
      throw new Error('No files were uploaded');
    }

    // Filter out undefined values and ensure all files are valid
    const validFiles = fileArray.filter((file): file is formidable.File => file !== undefined);
    
    const blobUrls = await Promise.all(
      validFiles.map(file => bufferToBlob(file))
    );

    if (!name) {
      throw new Error('Name is required');
    }

    const speciesValue = species || 'Unknown Species';

    const firstImageDetails = await getAnimalDetails(blobUrls[0], name, speciesValue);

    if (!firstImageDetails || !firstImageDetails.category) {
      throw new Error('Failed to get animal category from OpenAI');
    }

    const imageDetails = await Promise.all(
      blobUrls.map(async (url) => {
        const details = await getAnimalDetails(url, name, speciesValue);
        if (!details) {
          throw new Error('Failed to get image details from OpenAI');
        }
        return {
          path: url,
          species: details.species || speciesValue,
          description: details.description || 'No description available.',
        };
      })
    );

    const existingAnimal = await Animal.findOne({ name });

    if (existingAnimal) {
      existingAnimal.imageDetails.push(...imageDetails);
      existingAnimal.images.push(...blobUrls);

      if (!existingAnimal.species) {
        existingAnimal.species = species || firstImageDetails.species;
      }

      if (!existingAnimal.description) {
        existingAnimal.description = firstImageDetails.description;
      }

      await existingAnimal.save();
      return res.status(200).json({ success: true });
    }

    const animal = new Animal({
      name,
      species: species || firstImageDetails.species,
      description: firstImageDetails.description,
      category: firstImageDetails.category,
      imageDetails,
      images: blobUrls,
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