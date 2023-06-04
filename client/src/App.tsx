import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Eggtive from "./components/Eggtive";
import Login from "./components/users/Login";
import Navbar from "./components/Navbar";
import Register from "./components/users/Register";
import About from "./components/about/About";
import Home from "./components/home/Home";
import Reset from "./components/users/Reset";

const App = () => {
  return (
    <div className="App ">
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route path="board" element={<Eggtive />}></Route>
          <Route path="login" element={<Login />}></Route>
          <Route path="register" element={<Register />}></Route>
          <Route path="about" element={<About />}></Route>
          <Route path="reset" element={<Reset />}></Route>
          <Route index path="/" element={<Home />}></Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;