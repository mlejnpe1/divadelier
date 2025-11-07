import React, { useRef } from "react";
import CourseCard from "../components/CourseCard";
import PlaceholderImg from "../assets/images/placeholder.png";

const courses = [
  {
    title: "Dr. Zdiv",
    description:
      "Autorský kurz herectví vedený zkušenými lektory z Divadeliéru. Objevte svůj hlas, tělo i emoce v bezpečném tvůrčím prostoru.",
    image: PlaceholderImg,
  },
  {
    title: "Kurzy na míru",
    description:
      "Přizpůsobené kurzy pro jednotlivce i skupiny. Dvě varianty – sólo lekce nebo týmová spolupráce.",
    image: PlaceholderImg,
  },
  {
    title: "Přípravné kurzy",
    description:
      "Intenzivní příprava pro talentové zkoušky, konzervatoře i DAMU. Získejte jistotu, zkušenosti a osobní vedení.",
    image: PlaceholderImg,
  },
];

const CoursesPage = () => {
  return (
    <div className='bg-gray-50 text-gray-800 min-h-screen'>
      {courses.map((course, index) => (
        <CourseCard
          key={index}
          course={course}
          reverse={index % 2 === 1}
          isFirst={index === 0}
        />
      ))}
    </div>
  );
};

export default CoursesPage;
