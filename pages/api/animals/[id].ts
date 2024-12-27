// pages/api/animals/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { dbConnect } from '../../../lib/dbConnect';
import { Animal } from '../../../models/Animal';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;
  await dbConnect();

  switch (req.method) {
    case 'PUT':
      try {
        const updatedAnimal = await Animal.findByIdAndUpdate(
          id,
          { ...req.body },
          { new: true }
        );
        res.status(200).json(updatedAnimal);
      } catch {
        res.status(400).json({ message: 'Error updating animal' });
      }
      break;

    case 'DELETE':
      try {
        await Animal.findByIdAndDelete(id);
        res.status(200).json({ message: 'Animal deleted successfully' });
      } catch {
        res.status(400).json({ message: 'Error deleting animal' });
      }
      break;

    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}