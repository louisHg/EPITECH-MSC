import React  from "react";
import { Article } from "./Article";
import { useArticles } from "../../hooks/feed";
import { useLocation } from "react-router-dom";

export function Feed(){

    const location = useLocation(); 
    console.log(location); 

    const articles = useArticles(location.state.name); 

    return <div className="flex flex-col">
        {articles?.map((article, index)=>{
            return <Article key={index}
                            src={article.src} 
                            title={article.title} 
                            description={article.description}
                            link={article.link}
                            date={article.date}
                            />
        })}
    </div>
}



