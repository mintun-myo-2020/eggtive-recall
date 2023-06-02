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

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-sm mx-auto p-6 bg-white rounded shadow">
        <input
          type="text"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="w-full px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
          onClick={handleLogin}
        >
          Login
        </button>
        <button
          className="w-full px-4 py-2 mb-4 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none"
          onClick={signInWithGoogle}
        >
          Login with Google
        </button>
        <div className="text-center">
          <Link className="text-blue-500" to="/reset">
            Forgot Password
          </Link>
        </div>
        <div className="text-center">
          Don't have an account?{" "}
          <Link className="text-blue-500" to="/register">
            Register
          </Link>{" "}
          now.
        </div>
      </div>
    </div>
  );
}

export default Login;
