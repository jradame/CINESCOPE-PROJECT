import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Explore from "./components/Explore";
import Discounted from "./components/Discounted";
import Landing from "./components/Landing";
import Nav from "./components/Nav";
import Highlights from "./components/Highlights";
import Featured from "./components/Featured";





function Home() {
  return (
    <>
      <Landing />
      <Highlights />
      <Featured />
      <Discounted />
      <Explore />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books books={books} />} />
          <Route
            path="/books/:id"
            element={<BookInfo books={books} addToCart={addToCart} cart={cart} />}
          />
          <Route
            path="/cart"
            element={<Cart books={books} cart={cart} changeQuantity={changeQuantity} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
