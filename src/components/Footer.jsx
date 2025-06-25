import React from 'react';
import logo from "../assets/Library.svg";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row row__column">
          <a href="/">
            <figure className="footer__logo">
              <img src={logo} className="footer__logo--img" alt="Library Logo" />
            </figure>
          </a>
		  <div className="footer__list">
			<a href="/" className="footer_-link">Home</a>
			<span className="footer__link no-cursor">About</span>
			<a href="/books" class="footer__link">Books</a>
			<a href="/cart" class="footer__link">Cart</a>
		  </div>
		  <div className="footer copyright">© 2025 Library</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

