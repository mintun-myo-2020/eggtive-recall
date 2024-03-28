import { Link } from "react-router-dom";
import { TextGenerateEffect } from "../../components/ui/text-generate-effect";
import { DotBackground } from "../../components/ui/dot-background";

const Home = () => {
  const homeText =
    "Start using proven techniques like active recall with eggtive today!";

  const contents: JSX.Element = (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4">Welcome to Eggtive</h1>
      <p className="mb-8">
        <TextGenerateEffect
          words={homeText}
          className="text-lg text-gray-600 "
        />
      </p>
      <Link to={"about"} className="pageBtn">
        Learn More
      </Link>
    </div>
  );
  return <DotBackground contents={contents} />;
};

export default Home;
