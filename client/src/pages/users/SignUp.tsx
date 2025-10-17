import { useEffect, useState } from "react";
import { auth, registerWithEmailAndPassword } from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { Button, Label, TextInput, Card, Spinner } from "flowbite-react";
import { HiMail, HiLockClosed, HiUser } from "react-icons/hi";

const SignUp = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.emailVerified) navigate("/notebook");
  }, [user, loading, navigate]);

  const handleRegister = async () => {
    await registerWithEmailAndPassword(name, email, password);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.key === "Enter") {
      handleRegister();
    }
  };

  if (loading) {
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
              Create your account
            </h1>
            <p className="text-gray-600">Get started with Eggtive today</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="space-y-4">
            <div>
              <Label htmlFor="name" value="Full name" />
              <TextInput
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyUp={handleKeyPress}
                autoFocus
              />
            </div>

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
            <div>
              <Label htmlFor="conFirmPassword" value="Confirm Password" />
              <TextInput
                id="password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyUp={handleKeyPress}
              />
            </div>

            <Button
              type="submit"
              onClick={handleRegister}
              className="w-full"
              color="light"
              outline
            >
              Create account
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SignUp;
