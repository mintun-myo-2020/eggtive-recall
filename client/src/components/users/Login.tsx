import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  logInWithEmailAndPassword,
  signInWithGoogle,
} from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/board");
  }, [user, loading, navigate]);

  const handleLogin = async () => {
    await logInWithEmailAndPassword(email, password);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="flex bg-offwhite justify-center items-center h-screen">
      <div className="max-w-sm mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-center font-roboto text-3xl mb-3">
          Login to Eggtive
        </h1>
        <input
          type="text"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-slate-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          onKeyDown={handleKeyPress}
        />
        <input
          type="password"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-slate-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Password"
        />
        <button
          className="w-full px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-slate-500"
          onClick={handleLogin}
        >
          Login
        </button>
        <button
          className="w-full px-4 py-2 mb-4 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-slate-500"
          onClick={signInWithGoogle}
        >
          Login with Google
        </button>
        <div className="text-center text-gray-500 text-sm">
          <Link className="text-blue-500" to="/reset">
            Forgot Password
          </Link>
        </div>
        <div className="text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <Link className="text-blue-500" to="/register">
            Register
          </Link>{" "}
          now.
        </div>
      </div>
    </div>
  );
};

export default Login;
