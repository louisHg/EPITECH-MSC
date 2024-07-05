import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetAllowedSources } from "../../hooks/source";
import { setCheckedSource } from "../../redux/slice/sourceSlice";
import { putAllowedArticles } from "../../service/admin";
import { Card } from "./Card";

export default function Source() {
  const allowedSource = useGetAllowedSources();
  const sources = useSelector((state) => state.source);
  console.log(sources);
  console.log();
  const dispatch = useDispatch();

  const navigate = useNavigate()
  useEffect(() => {
    allowedSource.forEach((source) => {
      dispatch(
        setCheckedSource({
          name: source.name,
          checked: true,
        })
        );
    });
  }, [allowedSource]);

  const handleClick = (event) => {
    console.log(sources);
    const selected = sources.filter((element) => element.checked === true);
    const link = selected.map((element) => element.link); 
    const selectedSources = selected.map((element) => element.name);
    putAllowedArticles(selectedSources,link);
    
    // navigate('/crypto',{state : {sources} })
    // mettre une notification pour dire qu'on a uploadé les éléments
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-4 gap-6">
        {sources.map((item, index) => {
              console.log({item})
          return (
            <Card
              key={index}
              purpose={item.name}
              imageSrc={require(`../../image/${item.name}.jpg`)}
              link={item.link}
            />
          );
        })}
      </div>
      <div className="flex justify-center items-center">
        <button
          onClick={handleClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Valider
        </button>
      </div>
    </div>
  );
}
