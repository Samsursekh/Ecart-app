import React, { useState, useEffect } from "react";
import Image from "next/image";
import banner1 from "@/../../public/images/banner1.jpg";
import banner2 from "@/../../public/images/banner2.jpg";
import banner3 from "@/../../public/images/banner3.jpg";

const images = [banner1, banner2,banner3];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[400px]">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentIndex === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image}
            alt={`Banner ${index + 1}`}
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
          />
        </div>
      ))}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 space-x-2 bg-blue-200/60">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-3xl ${
              currentIndex === index ? "bg-white" : "bg-blue-800"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
