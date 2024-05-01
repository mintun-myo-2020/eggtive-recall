"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import Button from "@mui/material/Button";
import { Spinner } from "flowbite-react";
import { auth, registerWithEmailAndPassword } from "../../utils/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (user?.emailVerified) router.push("/notebook");
  }, [user, loading]);

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
              <Link href="login" className="text-blue-500">
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
