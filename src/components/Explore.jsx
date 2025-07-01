import React from "react";
import { Link } from "react-router-dom";

const Explore = () => {
	return (
		<section id="explore">
			<div className="container">
				<div className="row row__column">
					<h2 className="section__title">
						Explore <span className="purple">More</span>
					</h2>
					<Link to="/books">
						<button className="btn">Explore All Books</button>
					</Link>
				</div>
			</div>
		</section>
	)
}

export default Explore;
