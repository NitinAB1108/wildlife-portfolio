import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />
      <main className="flex-grow bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;