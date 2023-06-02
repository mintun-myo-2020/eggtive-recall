import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Eggtive from "./components/Eggtive";
import Login from "./components/users/Login";
import Navbar from "./components/Navbar";
import Register from "./components/users/Register";

const App = () => {
  return (
    <div className="App ">
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route path="board" element={<Eggtive />}></Route>
          <Route path="login" element={<Login />}></Route>
          <Route path="register" element={<Register />}></Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
