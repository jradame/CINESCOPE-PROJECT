import React from "react";
import Undraw_Books from "../assets/Undraw_Books.svg";

const Landing = () => {
  return (
    <section id="landing">
      <header>
        <div className="header__container">
          <div className="header__description">
            <h1>America&apos;s most awarded online library platform</h1>
            <h2>
              Find your dream book <span className="purple">Library</span>
            </h2>
            <a href="#features">
              <button className="btn">Browse books</button>
            </a>
          </div>
          <figure className="header__img--wrapper">
            <img src={Undraw_Books} alt="Stack of books illustration" />
          </figure>
        </div>
      </header>
    </section>
  );
};

export default Landing;
