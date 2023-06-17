import React from 'react';
import { Link } from 'react-router-dom';
import About from '../about/About';

const Home = () => {
  return (
    <div className="bg-offwhite min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Welcome to Eggtive</h1>
        <p className="text-lg text-gray-600 mb-8">Start using proven techniques like active recall with eggtive today!</p>
        <Link to={"about"} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default Home;
