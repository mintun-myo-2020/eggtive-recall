import { useEffect, useState } from "react";
import { auth, registerWithEmailAndPassword } from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, API_ENDPOINTS } from "../../api/endpoints";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { Spinner } from "flowbite-react";

const SignUp = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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
      <div className="Eggtive">
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <Spinner />
          <p className="text-lg text-gray-500 ">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-bgGray justify-center items-center h-screen ">
      <div className="max-w-sm mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-center font-roboto text-3xl mb-3">Sign Up</h1>
        <Box onSubmit={handleRegister} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="Name"
                autoFocus
                onChange={(e) => setName(e.target.value)}
                onKeyUp={handleKeyPress}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                onKeyUp={handleKeyPress}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={handleKeyPress}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            onClick={handleRegister}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <div>
            <p className="text-center text-gray-500 text-sm">
              Already have an account? <span> </span>
              <Link to="/login" className="text-blue-500">
                Login Here
              </Link>
            </p>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default SignUp;
