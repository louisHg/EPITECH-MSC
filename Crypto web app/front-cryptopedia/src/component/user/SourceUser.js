import   React  from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetAllowedSources } from "../../hooks/source";
import { setCheckedSource } from "../../redux/slice/sourceSlice";
import { putAllowedArticles } from "../../service/admin"; 
import { CardUser } from "./cardUser";
import axios from "axios";
import { getArticle } from "./data";
var session = JSON.parse(sessionStorage.getItem('sessionObject'));
if (session == null) {
    token = "";
}
else {
    var token = session.SessionData.token
}
    export default  function SourceUser() {
        
        // var sources =  getArticle() 
        // sources doit normalement prendre la valeur en base  
    const allowedSource = useGetAllowedSources();
    const sources = useSelector((state) => state.source); // valeur de api de base , doit normalement prendre la valeur getArticles()
    //   console.log(test);
    console.log(sources);
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
        putAllowedArticles(selectedSources, link);

        // navigate('/crypto',{state : {sources} })
        // mettre une notification pour dire qu'on a uploadé les éléments
    };

    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-4 gap-6">
                {sources.map((item, index) => {
                    console.log({ item })
                    return (
                        <CardUser
                            key={index}
                            purpose={item.name}
                            imageSrc={require(`../../image/${item.name}.jpg`)}
                            link={item.link}
                        />
                    );
                })}
            </div>
        </div>
    );
}
