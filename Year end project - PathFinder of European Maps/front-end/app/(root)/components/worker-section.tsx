import React from "react";
import WorkerCard from "./worker-card";

const WorkerSection = () => {
  const workers = [
    {
      url: "maxence_m.jpeg",
      linkedin: "https://www.linkedin.com/in/maxence-marqui-602a491b4/",
      name: "Maxence Marqui",
      post: "Founder & CEO",
      twitter: "https://twitter.com/LouisVnse",
    },
    {
      url: "jimmy_b.jpeg",
      linkedin: "https://www.linkedin.com/in/jimmy-bauduin/",
      name: "Jimmy Bauduin",
      post: "Co-Founder",
      twitter: "https://twitter.com/LouisVnse",
    },
    {
      url: "helios_w.jpeg",
      linkedin: "https://www.linkedin.com/in/helioswan/",
      name: "Hélios Wan",
      post: "Product Manager",
      twitter: "https://twitter.com/LouisVnse",
    },
    {
      url: "matteo_d.jpeg",
      linkedin: "https://www.linkedin.com/in/louis-vanoise-551493233/",
      name: "Mattéo Da Costa G.",
      post: "Product Manager",
      twitter: "https://twitter.com/LouisVnse",
    },
    {
      url: "louis_v.jpeg",
      linkedin: "https://www.linkedin.com/in/louis-vanoise-551493233/",
      name: "Louis Vanoise",
      post: "CTO",
      twitter: "https://twitter.com/LouisVnse",
    },
    {
      url: "maxence_e.jpeg",
      linkedin: "https://www.linkedin.com/in/maxence-el-khader/",
      name: "Maxence El Khader",
      post: "Fullstack developer",
      twitter: "https://twitter.com/LouisVnse",
    },
    {
      url: "louis_h.jpeg",
      linkedin: "https://www.linkedin.com/in/louis-huyghe/",
      name: "Louis Huyghe",
      post: "Fullstack developer",
      twitter: "https://twitter.com/LouisVnse",
    },
  ];
  return (
    <div className="flex flex-wrap w-full justify-center my-16 container mx-auto">
      {workers.map((worker, index) => (
        <WorkerCard
          key={index}
          url={worker.url}
          name={worker.name}
          post={worker.post}
          linkedin={worker.linkedin}
          twitter={worker.twitter}
        />
      ))}
    </div>
  );
};

export default WorkerSection;
