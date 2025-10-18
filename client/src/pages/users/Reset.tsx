import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordReset } from "../../utils/firebase";
import { Button, Label, TextInput, Card, Alert } from "flowbite-react";

const Reset = () => {
  const [email, setEmail] = useState<string>("");
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleReset();
    }
  };

  const handleReset = async () => {
    try {
      await sendPasswordReset(email);
      setEmailSent(true);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex bg-gray-50 justify-center items-center min-h-screen py-12 px-4">
      <Card className="w-full max-w-md">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reset your password
            </h1>
            <p className="text-gray-600">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {emailSent && (
            <Alert color="success" >
              <span className="font-medium">Check your email!</span> We've sent you a password reset link.
            </Alert>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleReset(); }} className="space-y-4">
            <div>
              <Label htmlFor="email" value="Email address" />
              <TextInput
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyUp={handleKeyPress}
                autoFocus
              />
            </div>

            <Button
              type="submit"
              onClick={handleReset}
              className="w-full"
              size="lg"
              color="light"
            >
              Send reset link
            </Button>
          </form>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-blue-600 hover:underline font-medium"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reset;
