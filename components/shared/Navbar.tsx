import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Navbar = () => {
  const router = useRouter();
  const isHomePage = router.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="fixed w-full z-50 px-4 py-4">
      <nav className="max-w-7xl mx-auto backdrop-blur-md bg-white/10 rounded-2xl shadow-lg border border-white/20">
        <div className="px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {!isHomePage && (
                <button
                  onClick={() => router.back()}
                  className="text-white/90 hover:text-green-600 transition-colors"
                  aria-label="Go back"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              )}
              <Link href="/" className="text-xl font-bold text-green-600/90 hover:text-green-600 transition-colors">
                NABGRAPHY
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-white/90 hover:text-green-600 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/" 
                className="text-white/90 hover:text-green-600 transition-colors font-medium"
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="text-white/90 hover:text-green-600 transition-colors font-medium"
              >
                About
              </Link>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden mt-4 space-y-4`}>
            <Link 
              href="/" 
              className="block text-white/90 hover:text-green-600 transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="block text-white/90 hover:text-green-600 transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;