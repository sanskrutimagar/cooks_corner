// Carousel1.js
import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

function SlideShow() {
  return (
    <div className="div">
      {/* Carousel component from react-bootstrap */}
      <Carousel>

        {/* First Carousel Item */}
        <Carousel.Item>
          {/* Box containing the image */}
          <div className="box">
            <img className='img_poster' src="/images/FoodBanner1.png" alt="" />
          </div>
          
        </Carousel.Item>

        {/* Second Carousel Item */}
        <Carousel.Item>
          {/* Box containing the image */}
          <div className="box">
            <img className='img_poster' src="/images/FoodBanner2.png" alt="" />
          </div>
         
        </Carousel.Item>

        {/* Third Carousel Item */}
        <Carousel.Item>
          {/* Box containing the image */}
          <div className="box">
            <img className='img_poster' src="/images/FoodBanner3.png" alt="" />
          </div>
          {/* Caption for the third item */}
          
        </Carousel.Item>

      </Carousel>
    </div>
  );
}

export default SlideShow;
