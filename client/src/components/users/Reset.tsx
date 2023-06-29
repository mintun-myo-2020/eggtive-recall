import React, { useState } from "react";
import { sendPasswordReset } from "../../utils/firebase";

const Reset = () => {
  const [email, setEmail] = useState<string>("");

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendPasswordReset(email);
    }
  };

  const handleReset = async () => {
    await sendPasswordReset(email);
  };

  return (
    <div className="flex bg-bgGray justify-center items-center h-screen">
      <div className="max-w-sm mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-center font-roboto text-3xl mb-3">
          Reset password
        </h1>
        <input
          type="text"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-slate-500"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyPress}
          value={email}
        />
        <button
          onClick={handleReset}
          className="capitalize w-full px-4 py-2 mb-4 text-white bg-blue-500 hover:bg-blue-600 rounded focus:outline-slate-500"
        >
          Confirm reset email
        </button>
      </div>
    </div>
  );
};

export default Reset;
