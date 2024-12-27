import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gradient-to-b from-green-100 to-blue-50 pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;