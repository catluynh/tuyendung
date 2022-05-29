import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaStar } from "react-icons/fa";
const StarRating = (props) => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  return (
    <div>
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;
        return (
          <label>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => {
                setRating(ratingValue);
              }}
            ></input>
            <FaStar
              className="star pointer"
              size={30}
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              onMouseEnter={() => {
                setHover(ratingValue);
              }}
              onMouseLeave={() => {
                setHover(null);
              }}
              onClick={() => {
                console.log("Click star");
                props.onHandleStar(ratingValue);
              }}
            />
          </label>
        );
      })}
    </div>
  );
};

StarRating.propTypes = {};

export default StarRating;
