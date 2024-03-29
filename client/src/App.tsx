import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Board from "./components/egg/Board";
import Login from "./pages/users/Login";
import Navbar from "./components/navbar/Navbar";
import SignUp from "./pages/users/SignUp";
import About from "./pages/about/About";
import Home from "./pages/home/Home";
import Reset from "./pages/users/Reset";
import TextEditor from "./components/notebook/textEditor/TextEditor";
import Notebook from "./pages/notebook/Notebook";

const App = () => {
  return (
    <div className="App ">
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route path="board" element={<Board />}></Route>
          <Route path="login" element={<Login />}></Route>
          <Route path="register" element={<SignUp />}></Route>
          <Route path="about" element={<About />}></Route>
          <Route path="reset" element={<Reset />}></Route>
          <Route path="notebook" element={<Notebook />}></Route>
          <Route path="notebook/:currentNoteId" element={<Notebook />} />
          <Route index path="/" element={<Home />}></Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
