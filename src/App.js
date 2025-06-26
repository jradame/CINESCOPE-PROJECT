import { Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Nav from "./components/Nav";



function App() {
  return (
    <Router>
      <div className="App">
        
        <Nav />
        <Route path="/" exact component={Home} />
        <Footer />
      </div>

    </Router>
    
  );
}



export default App;
