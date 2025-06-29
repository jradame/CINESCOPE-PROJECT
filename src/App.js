import { BrowserRouter as Router, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Nav from "./components/Nav";
import Books from "./pages/Books";



function App() {
  return (
    <Router>
      <div className="App">
        
        <Nav />
        <Route path="/" exact component={Home} />
        <Route path="/books" component={Books} />
        
        <Footer />
      </div>

    </Router>
    
  );
}



export default App;
