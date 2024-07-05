import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCheckedSource } from "../../redux/slice/sourceSlice";
import { useNavigate } from "react-router-dom";

export function CardUser({ purpose, imageSrc, link }) {
  const inputRef = useRef(null);
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();
  const sources = useSelector((state) => state.source);
  const navigate = useNavigate();

  const handleLink = () => {
    navigate("/Article", { state: { id: 1, name: link } });
  };
  useEffect(() => {
    sources.forEach((element) => {
      if (element.name === purpose) {
        setChecked(element.checked);
      }
    });
  }, [sources]);

  return (
    <div className="h-60 w-60 flex flex-col relative" aria-valuenow={link}>
      <div className="font-semibold text-xl flex-1 flex justify-center items-center">
        {purpose}
      </div>
      <div className="flex-[3] flex justify-center items-center">
        <img
          onClick={handleLink}
          src={imageSrc}
          alt="bitcoin"
          className="object-contain"
          width={"100px"}
          height={"100px"}
        />
      </div>
    </div>
  );
}
