import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';


function renderStars(rating) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FontAwesomeIcon icon="star" key={i} />);
  }
  if (halfStar) {
    stars.push(<FontAwesomeIcon icon="star-half-alt" key="half" />);
  }
  while (stars.length < 5) {
    stars.push(<FontAwesomeIcon icon="star-o" key={`empty-${stars.length}`} />);
  }
  return stars;
}

const Book = ({ book }) => {
  return (
    <div className="book">
      <a href={book.link || '#'}>
        <figure className="book__img--wrapper">
          <img
            src={book.image}
            alt={book.title}
            className="book__img"
          />
        </figure>
      </a>
      <div className="book__title">
        <a href={book.link || '#'} className="book__title--link">
          {book.title}
        </a>
      </div>
      <div className="book__ratings">
        {renderStars(book.rating)}
      </div>
      <div className="book__price">
        {book.salePrice
          ? (
            <>
              <span className="book__price--normal">${book.originalPrice.toFixed(2)}</span>
              ${book.salePrice.toFixed(2)}
            </>
          )
          : <>${book.originalPrice.toFixed(2)}</>
        }
      </div>
    </div>
  );
};

export default Book;
