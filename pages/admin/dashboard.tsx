// pages/admin/dashboard.tsx
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import AdminLayout from '../../components/layouts/AdminLayout';

const AdminDashboard = () => {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link href="/admin/upload" className="group">
                <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300">
                  <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    Upload New Content
                  </h2>
                  <p className="mt-2 text-gray-600">Add new wildlife photographs and information</p>
                </div>
              </Link>
              
              <Link href="/admin/manage" className="group">
                <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300">
                  <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    Manage Content
                  </h2>
                  <p className="mt-2 text-gray-600">Edit or delete existing wildlife entries</p>
                </div>
              </Link>
            </div>
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

export default AdminDashboard;