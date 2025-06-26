import { Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Nav from "./components/Nav";



function App() {
  return (
    <Router>
      <div classNmae="App">
        <Route />
        <Nav />
        <Footer />
      </div>

    </Router>
    
  );
}



export default App;
