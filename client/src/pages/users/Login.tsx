import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  logInWithEmailAndPassword,
  signInWithGoogle,
} from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Spinner } from "flowbite-react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { SiGoogle } from "@icons-pack/react-simple-icons";
import { red } from "@mui/material/colors";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [user, loading, error] = useAuthState(auth);

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/notebook");
  }, [user, loading, navigate]);

  const handleLogin = async (
  ) => {
    await logInWithEmailAndPassword(email, password);
    setIsLoggingIn(true);
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleLogin();
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  if (isLoggingIn) {
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
        <h1 className="text-center font-oxygen text-3xl mb-3">
          Login to Eggtive
        </h1>
        <Box
          noValidate
          component={"form"}
          onSubmit={handleLogin}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
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
            onClick={handleButtonClick}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Button
            type="submit"
            onClick={signInWithGoogle}
            fullWidth
            variant="contained"
            sx={{
              mb: 2,
              background: red[400],
              "&:hover": { background: red[400] },
            }}
          >
            <SiGoogle className="mr-3" /> Login with Google
          </Button>
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
        </Box>
      </div>
    </div>
  );
};

export default Login;
