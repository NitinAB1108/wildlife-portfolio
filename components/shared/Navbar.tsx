import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();
  const isHomePage = router.pathname === '/';

  return (
    <div className="fixed w-full z-50 px-4 py-4">
      <nav className="max-w-7xl mx-auto backdrop-blur-md bg-white/10 rounded-2xl shadow-lg border border-white/20">
        <div className="px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {!isHomePage && (
                <button
                  onClick={() => router.back()}
                  className="text-gray-600/90 hover:text-green-600 transition-colors"
                  aria-label="Go back"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              )}
              <Link href="/" className="text-xl font-bold text-green-600/90 hover:text-green-600 transition-colors">
                Wildlife Portfolio
              </Link>
            </div>
            
            <div className="flex items-center space-x-8">
              <Link 
                href="/" 
                className="text-gray-600/90 hover:text-green-600 transition-colors font-medium"
              >
                Gallery
              </Link>
              <Link 
                href="/about" 
                className="text-gray-600/90 hover:text-green-600 transition-colors font-medium"
              >
                About
              </Link>
              <Link 
                href="/order-prints" 
                className="px-4 py-2 bg-green-600/90 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
              >
                Order Prints
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;