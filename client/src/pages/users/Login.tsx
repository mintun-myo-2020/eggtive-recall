import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  logInWithEmailAndPassword,
  signInWithGoogle,
} from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button, Label, TextInput, Card, Spinner, Flowbite } from "flowbite-react";
import { SiGoogle } from "@icons-pack/react-simple-icons";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [user, loading, error] = useAuthState(auth);

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (user) {
      // Allow Google users or verified email users
      const isGoogleUser = user.providerData[0]?.providerId === 'google.com';
      if (isGoogleUser || user.emailVerified) {
        setIsLoggingIn(true);
        navigate("/notebook");
      }
    }
  }, [user, loading, navigate]);

  const handleLogin = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    await logInWithEmailAndPassword(email, password);
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleLogin();
  }

  const handleGoogleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await signInWithGoogle();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleLogin();
    }
  };

  if (isLoggingIn) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 justify-center items-center min-h-screen py-12 px-4">
      <Card className="w-full max-w-md">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600">Sign in to your Eggtive account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" value="Email address" />
              <TextInput
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyUp={handleKeyPress}
              />
            </div>

            <div>
              <Label htmlFor="password" value="Password" />
              <TextInput
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={handleKeyPress}
              />
            </div>

            <div className="flex items-center justify-end">
              <Link
                to="/reset"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              onClick={handleButtonClick}
              className="w-full"
              size="lg"
              color="light"
            >
              Sign in
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full"
            color="light"
            outline
          >
            <SiGoogle className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
