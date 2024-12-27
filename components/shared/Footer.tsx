const Footer = () => {
    return (
      <footer className="bg-white shadow-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Wildlife Portfolio</h3>
              <p className="text-gray-600">
                Documenting and preserving wildlife through photography
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-600 hover:text-green-600">About</a></li>
                <li><a href="/order-prints" className="text-gray-600 hover:text-green-600">Order Prints</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
              <p className="text-gray-600">
                Email: contact@wildlife-portfolio.com<br />
                Follow us on social media
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            © {new Date().getFullYear()} Wildlife Portfolio. All rights reserved.
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;