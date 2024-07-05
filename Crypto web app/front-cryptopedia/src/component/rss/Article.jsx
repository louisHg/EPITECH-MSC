import React from "react" ; 

export function Article({src, title, date, description, link}){

    const openLink = () =>{
        Object.assign(document.createElement('a'), {
            target: '_blank',
            rel: 'noopener noreferrer',
            href: link,
        }).click();
    }

    return (
    <div onClick={openLink} className="w-10/12 h-36 border-solid border-black shadow-md rounded-lg flex hover:shadow-xl hover:cursor-pointer border-solid">
        <div className="flex-1 h-full flex justify-center items-center">
            <div className="h-5/6 w-4/6 flex justify-center items-center">
                <img src={src} className="rounded-lg h-full w-full" />
            </div>
        </div>
        <div className="flex-[4] h-full grid-rows-3">
            <div className=" font-bold text-2xl mt-2 w-full flex-start text-left">
                {title}
            </div>
            <div className="text-left w-full">
                {date}
            </div>
            <div className="text-left text-lg mt-3 w-full">
                <p>{description}</p>
            </div>
        </div>
    </div> 
    )
}