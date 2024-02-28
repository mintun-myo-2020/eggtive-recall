import React from "react";
import { Link } from "react-router-dom";
import About from "../about/About";
import { TextGenerateEffect } from "../../components/ui/text-generate-effect";

const Home = () => {

  const homeText = "Start using proven techniques like active recall with eggtive today!";

  return (
    <div className="bg-bgGray min-h-screen flex flex-col justify-center items-center font-oxygen">
      <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Welcome to Eggtive</h1>
        <p className="mb-8">
          <TextGenerateEffect words={homeText} className="text-lg text-gray-600 " />
        </p>
        <Link to={"about"} className="pageBtn">
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default Home;
