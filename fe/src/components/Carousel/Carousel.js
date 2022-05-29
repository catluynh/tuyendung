import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GlobalData } from "../../data/globalData";

const CarouselImage = () => {
  const images = GlobalData.carouselImage();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };
  return (
    <div className="carousel">
      <Slider {...settings}>
        {images.map((item, index) => {
          return (
            <div key={index} className="carousel-image">
              <img
                src={item.image}
                alt="carousel"
                style={{ height: "300px" }}
              />
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default CarouselImage;
