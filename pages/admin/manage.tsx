// pages/admin/manage.tsx
import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Animal, IAnimal } from '../../models/Animal';
import { dbConnect } from '../../lib/dbConnect';
import Image from 'next/image';
import AdminLayout from '../../components/layouts/AdminLayout';

interface ManagePageProps {
  initialAnimals: IAnimal[];
}

const ManagePage = ({ initialAnimals }: ManagePageProps) => {
    const [error, setError] = useState<string | null>(null);
    const [animals, setAnimals] = useState(initialAnimals);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({
      name: '',
      species: '',
      category: '',
      description: '',
      location: '',
    });
  
    if (error) {
      return (
        <AdminLayout>
          <div className="p-4 text-red-500">
            Error: {error}
          </div>
        </AdminLayout>
      );
    }
  
  const handleEdit = (animal: IAnimal) => {
    setEditingId(animal._id);
    setEditForm({
      name: animal.name,
      species: animal.species,
      category: animal.category,
      description: animal.description,
      location: animal.location,
    });
  };

  const handleSave = async (id: string) => {
    try {
      const response = await fetch(`/api/animals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) throw new Error('Failed to update');

      const updatedAnimal = await response.json();
      setAnimals(animals.map(animal => 
        animal._id === id ? { ...animal, ...updatedAnimal } : animal
      ));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating animal:', error);
      alert('Failed to update animal');
    }
    console.log('Animal data:', {
        imageDetails: animal.imageDetails,
        images: animal.images,
        paths: animal.imageDetails?.map(img => img.path)
      });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const response = await fetch(`/api/animals/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      setAnimals(animals.filter(animal => animal._id !== id));
    } catch (error) {
      console.error('Error deleting animal:', error);
      alert('Failed to delete animal');
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Manage Wildlife Content</h1>
          
          <div className="grid gap-6">
            {animals.map((animal) => (
              <div key={animal._id} className="bg-white rounded-lg shadow p-6">
                {editingId === animal._id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="block w-full border rounded p-2"
                      placeholder="Name"
                    />
                    <input
                      type="text"
                      value={editForm.species}
                      onChange={(e) => setEditForm({ ...editForm, species: e.target.value })}
                      className="block w-full border rounded p-2"
                      placeholder="Species"
                    />
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="block w-full border rounded p-2"
                    >
                      <option value="">Select Category</option>
                      <option value="Arthropods">Arthropods</option>
                      <option value="Mollusks">Mollusks</option>
                      <option value="Worms">Worms</option>
                      <option value="Cnidarians">Cnidarians</option>
                      <option value="Echinoderms">Echinoderms</option>
                      <option value="Sponges">Sponges</option>
                      <option value="Fish">Fish</option>
                      <option value="Birds">Birds</option>
                      <option value="Reptiles">Reptiles</option>
                      <option value="Amphibians">Amphibians</option>
                      <option value="Mammals">Mammals</option>
                    </select>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="block w-full border rounded p-2"
                      placeholder="Description"
                      rows={3}
                    />
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="block w-full border rounded p-2"
                      placeholder="Location"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSave(animal._id)}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display View
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold">{animal.name}</h2>
                        <p className="text-gray-600">{animal.species}</p>
                        <p className="text-gray-600">Category: {animal.category}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(animal)}
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(animal._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <p className="mt-2">{animal.description}</p>
                    <p className="text-gray-600 mt-2">Location: {animal.location}</p>
                    
                    <div className="grid grid-cols-4 gap-4 mt-4">
                    {(animal.imageDetails || []).map((image, index) => (
                        <div key={index} className="relative h-32">
                        <Image
                            src={image.path}
                            alt={`${animal.name} ${index + 1}`}
                            fill
                            className="object-cover rounded"
                            unoptimized
                        />
                        </div>
                    ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManagePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
  
    if (!session) {
      return {
        redirect: {
          destination: '/admin/login',
          permanent: false,
        },
      };
    }
  
    await dbConnect();
    const animals = await Animal.find({}).lean();
  
    // Ensure each animal has imageDetails
    const processedAnimals = animals.map(animal => ({
      ...animal,
      imageDetails: animal.imageDetails || [],
      _id: animal._id.toString()
    }));
  
    return {
      props: {
        initialAnimals: JSON.parse(JSON.stringify(processedAnimals)),
      },
    };
  };