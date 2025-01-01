import MainLayout from '../../components/layouts/MainLayout';
const AboutPage = () => {
    return (
        <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            About Our Wildlife Portfolio
          </h1>
          
          <div className="bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
            <p className="text-lg text-gray-300">
              Welcome to our Wildlife Portfolio, a dedicated platform showcasing the incredible 
              diversity of life on our planet. Our mission is to document and share the beauty 
              of wildlife through professional photography and detailed information.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8">Our Mission</h2>
            <p className="text-lg text-gray-300">
              We strive to create awareness about wildlife conservation through visual storytelling, 
              providing detailed information about various species and their habitats.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8">Photography</h2>
            <p className="text-lg text-gray-300">
              All photographs in our portfolio are captured with respect for wildlife and their 
              natural habitats. We follow strict ethical guidelines to ensure minimal disruption 
              to the animals we photograph.
            </p>
          </div>
        </div>
      </div>
      </MainLayout>
    );
  };
  
  export default AboutPage;