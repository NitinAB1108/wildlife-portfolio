import MainLayout from '../../components/layouts/MainLayout';
const OrderPrintsPage = () => {
    return (
        <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Order Wildlife Prints
          </h1>
          
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <p className="text-lg text-gray-700">
                Transform your space with our high-quality wildlife prints. 
                Each print is carefully produced to showcase the natural beauty 
                of our wildlife subjects.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Print Options</h2>
                <ul className="space-y-2 text-gray-700">
                  <li>• Fine Art Prints</li>
                  <li>• Canvas Prints</li>
                  <li>• Metal Prints</li>
                  <li>• Framed Prints</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">How to Order</h2>
                <p className="text-gray-700">
                  Contact us with the image reference and your preferred print option. 
                  We&apos;ll provide a quote and work with you to create the perfect print 
                  for your space.
                </p>
                
                <button className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                  Contact for Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </MainLayout>
    );
  };
  
  export default OrderPrintsPage;