import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";
import { TextGenerateEffect } from "../../components/ui/text-generate-effect";
import { DotBackground } from "../../components/ui/dot-background";
import { BookOpen, LayoutGrid } from "lucide-react";

const Home = () => {
  const [user] = useAuthState(auth);
  const isGoogleUser = user?.providerData[0]?.providerId === 'google.com';
  const isAuthenticated = user && (isGoogleUser || user.emailVerified);

  if (isAuthenticated) {
    // Dashboard for logged-in users
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.displayName || 'there'}!
          </h1>
          <p className="text-gray-600 mb-8">
            Ready to boost your learning with active recall?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/board"
              className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-blue-300"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <LayoutGrid className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Board</h2>
              </div>
              <p className="text-gray-600">
                Create and review flashcards using spaced repetition
              </p>
            </Link>

            <Link
              to="/notebook"
              className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-green-300"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Notebook</h2>
              </div>
              <p className="text-gray-600">
                Take notes and organize your learning materials
              </p>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Landing page for non-authenticated users
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
