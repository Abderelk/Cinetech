import React from "react";

const EmptyFilm = ({ index }) => {
  return (
    <div className="w-64" key={index}>
      <div>
        <div className="object-cover h-96 cursor-pointer" />
      </div>
    </div>
  );
};
export default EmptyFilm;
