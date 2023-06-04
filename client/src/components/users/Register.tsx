import { useEffect, useState } from "react";
import { auth, registerWithEmailAndPassword } from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, API_ENDPOINTS } from "../../api/endpoints";

const Register = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) navigate("/board");
  }, [user, loading, navigate]);

  const handleRegister = async () => {
    await registerWithEmailAndPassword(name, email, password);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-sm mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-center font-roboto text-3xl mb-3">Register</h1>
        <input
          type="text"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-slate-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="text"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-slate-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
        />
        <input
          type="password"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-slate-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="w-full px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-slate-500"
          onClick={handleRegister}
        >
          Register
        </button>
        <div>
          <p className="text-center text-gray-500 text-sm">
            Already have an account? <span> </span>
            <Link to="/login" className="text-blue-500">
              Log in Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
