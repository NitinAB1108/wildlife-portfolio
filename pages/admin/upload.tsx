// pages/admin/upload.tsx
import { useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Image from 'next/image';

interface UploadState {
    name: string;
    species: string;
    location: string;
    images: File[];
    previews: string[];
    loading: boolean;
    error: string;
    success: string;
  }

  const UploadPage = () => {
  const [state, setState] = useState<UploadState>({
    name: '',
    species: '',
    location: '',
    images: [],
    previews: [],
    loading: false,
    error: '',
    success: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const previews = files.map(file => URL.createObjectURL(file));
      
      setState(prev => ({
        ...prev,
        images: files,
        previews,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true, error: '', success: '' }));

    try {
        const formData = new FormData();
            formData.append('name', state.name);
            formData.append('species', state.species);
            formData.append('location', state.location);
            state.images.forEach(image => {
            formData.append('images', image);
            });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setState(prev => ({
        ...prev,
        success: 'Images uploaded successfully!',
        location: '',
        images: [],
        previews: [],
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <AdminLayout>
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Upload Wildlife Images</h1>
        
        {state.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {state.error}
          </div>
        )}
        
        {state.success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {state.success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
            <label className="block text-sm font-medium text-gray-700">
            Animal Name
            </label>
            <input
            type="text"
            value={state.name}
            onChange={(e) => setState(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">
                Scientific Species Name
            </label>
            <input
                type="text"
                value={state.species}
                onChange={(e) => setState(prev => ({ ...prev, species: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
                placeholder="e.g. Panthera leo"
            />
            </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">
            Location
            </label>
            <input
            type="text"
            value={state.location}
            onChange={(e) => setState(prev => ({ ...prev, location: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
            />
        </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Images
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              multiple
              accept="image/*"
              className="mt-1 block w-full"
              required
            />
          </div>

          {state.previews.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {state.previews.map((preview, index) => (
                <div key={index} className="relative h-40">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={state.loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              state.loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {state.loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
    </AdminLayout>
  );
};

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

  return {
    props: {},
  };
};

export default UploadPage;