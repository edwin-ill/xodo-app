import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from "@/components/component/EmblaCarouselArrowButtons";

type VehicleImage = {
  id: number;
  vehicleId: number;
  imageUrl: string;
};

type PropType = {
  vehicleImages: VehicleImage[];
  options?: EmblaOptionsType;
  onSlideChange?: (index: number) => void;
};

export const EmblaCarousel: React.FC<PropType> = ({ vehicleImages, options, onSlideChange }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', () => {
      if (onSlideChange) {
        onSlideChange(emblaApi.selectedScrollSnap());
      }
    });
  }, [emblaApi, onSlideChange]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', () => setSelectedIndex(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  const handlePrevButtonClick = (e) => {
    e.stopPropagation();
    onPrevButtonClick();
  };

  const handleNextButtonClick = (e) => {
    e.stopPropagation();
    onNextButtonClick();
  };

  return (
    <div className="embla relative">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {vehicleImages.map((image) => (
            <div className="embla__slide w-full" key={image.id}>
              <div className="embla__slide__inner aspect-[16/9]">
                <img 
                  src={image.imageUrl} 
                  alt="Vehicle" 
                  className="embla__slide__img w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="embla__buttons">
        <PrevButton onClick={handlePrevButtonClick} disabled={prevBtnDisabled} />
        <NextButton onClick={handleNextButtonClick} disabled={nextBtnDisabled} />
      </div>
      <div className="embla__dots">
        {vehicleImages.map((_, index) => (
          <button
            key={index}
            className={`embla__dot ${index === selectedIndex ? 'embla__dot--selected' : ''}`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};