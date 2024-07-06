import { db } from "@/lib/db";
import { Hiking } from "@/types";
import { ArrowRight } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface TravelSliderProps {
  isVisible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  currentHiking: Hiking;
}

const TravelSlider: React.FC<TravelSliderProps> = ({
  isVisible,
  setVisible,
  currentHiking,
}) => {
  return (
    <div
      className={`${
        isVisible ? "" : "mr-[-400px]"
      } max-h-fit h-full absolute w-[400px] flex flex-col  right-0 duration-500 ease-in-out bg-white z-10 transition-all`}
    >
      <div
        className="bg-cover flex p-3 flex-col justify-between items-start text-white bg-center bg-no-repeat w-full h-[250px] "
        style={{
          backgroundImage: `url("/images/LandingPage/Suggestion/bg.jpg")`,
        }}
      >
        <ArrowRight
          size={40}
          onClick={() => {
            setVisible(false);
          }}
          color="white"
          className="top-0 cursor-pointer hover:scale-105 transition-transform duration-300 transform p-2"
        />
        <div className="flex flex-col">
          <h3 className="font-bold text-lg">{currentHiking.name}</h3>
          <p className="font-light text-md">
            {currentHiking.city},{currentHiking.area}, {currentHiking.country}
          </p>
        </div>
      </div>
      <div className="flex py-3 px-5 flex-col gap-y-4">
        <h3>Description</h3>
        <p className="text-sm font-light">{currentHiking.description}</p>
      </div>
    </div>
  );
};

export default TravelSlider;
