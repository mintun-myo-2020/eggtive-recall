import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="bg-offwhite min-h-screen flex flex-col justify-center items-center font-oxygen">
      <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">About Our App</h1>
        <p className="text-lg text-gray-600 mb-8">
          Our app utilizes proven research techniques like spaced repetition and
          active recall to enhance learning and memory retention. Spaced
          repetition is a learning technique that optimizes the timing of review
          sessions, ensuring that you review information at increasing intervals
          to reinforce long-term retention. Active recall involves actively
          retrieving information from memory, which enhances learning and
          improves long-term retention compared to passive reviewing.
        </p>
        <p className="text-lg text-gray-600 mb-8">
          With our app, you can create flashcards or study materials and
          leverage the power of spaced repetition and active recall. The app
          intelligently schedules review sessions based on the difficulty of
          each flashcard and your performance, ensuring efficient and effective
          learning. Improve your knowledge retention and enhance your learning
          experience with our app today!
        </p>
        <Link to={"/register"} className="pageBtn">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default About;
