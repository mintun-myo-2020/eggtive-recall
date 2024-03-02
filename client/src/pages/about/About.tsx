import React from "react";
import { Link } from "react-router-dom";
import { DotBackground } from "../../components/ui/dot-background";
import { Accordion, AccordionContent, AccordionTitle } from "flowbite-react";
import { TextGenerateEffect } from "../../components/ui/text-generate-effect";

const eggtiveIntro = `Eggtive utilizes proven research techniques like spaced repetition and active recall to enhance learning and memory retention.`;

const About = () => {
  const contents: JSX.Element = (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <Accordion className="mb-5">
        <Accordion.Panel>
          <AccordionTitle>What is Eggtive?</AccordionTitle>
          <AccordionContent>
            <p className="text-lg text-black mb-8">
              <TextGenerateEffect
                words={eggtiveIntro}
                className="text-lg text-gray-600 "
              />
            </p>
          </AccordionContent>
        </Accordion.Panel>
        <Accordion.Panel>
          <AccordionTitle>
            What are Active Recall and Spaced Repitiion?
          </AccordionTitle>
          <AccordionContent>
            <p className="text-lg text-black mb-8">
              Spaced repetition is a learning technique that optimizes the
              timing of review sessions, ensuring that you review information at
              increasing intervals to reinforce long-term retention. Active
              recall involves actively retrieving information from memory, which
              enhances learning and improves long-term retention compared to
              passive reviewing.
            </p>
          </AccordionContent>
        </Accordion.Panel>
        <Accordion.Panel>
          <AccordionTitle>What can Eggtive do for me?</AccordionTitle>
          <AccordionContent>
            <p className="text-lg text-black mb-8">
              With Eggtive, you can create flashcards or study materials and
              leverage the power of spaced repetition and active recall. The app
              intelligently schedules review sessions based on the difficulty of
              each flashcard and your performance, ensuring efficient and
              effective learning. Improve your knowledge retention and enhance
              your learning experience with Eggtive today!
            </p>
          </AccordionContent>
        </Accordion.Panel>
      </Accordion>
      <Link to={"/register"} className="pageBtn">
        Get Started
      </Link>
    </div>
  );

  return <DotBackground contents={contents} />;
};

export default About;
