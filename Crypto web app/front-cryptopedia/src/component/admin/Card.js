import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCheckedSource } from "../../redux/slice/sourceSlice";

export function Card({ purpose, imageSrc, link }) {
  const inputRef = useRef(null);
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();
  const sources = useSelector((state) => state.source);

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
          src={imageSrc}
          alt="bitcoin"
          className="object-contain"
          width={"100px"}
          height={"100px"}
        />
      </div>
      <div className="flex-1 flex justify-center items-center">
        <input
          type="checkbox"
          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
          value={purpose}
          checked={checked}
          onChange={(e) =>
            dispatch(
              setCheckedSource({ name: purpose, checked: e.target.checked })
            )
          }
        />
      </div>
    </div>
  );
}
