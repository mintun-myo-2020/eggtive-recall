import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Board from "./components/egg/Board";
import Login from "./pages/users/Login";
import SignUp from "./pages/users/SignUp";
import About from "./pages/about/About";
import Home from "./pages/home/Home";
import Reset from "./pages/users/Reset";
import Notebook from "./pages/notebook/Notebook";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<SignUp />} />
            <Route path="about" element={<About />} />
            <Route path="reset" element={<Reset />} />

            {/* Protected routes */}
            <Route path="board" element={<ProtectedRoute><Board /></ProtectedRoute>} />
            <Route path="notebook" element={<ProtectedRoute><Notebook /></ProtectedRoute>} />
            <Route path="notebook/:currentNoteId" element={<ProtectedRoute><Notebook /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
