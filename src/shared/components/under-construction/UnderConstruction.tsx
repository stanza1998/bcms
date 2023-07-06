import React from "react";

const style = {
  image: {
    borderRadius: 10,
    maxWidth: 400,
    maxHeight: 400,
    overflow: "hidden",
  },
  img: {
    objectFit: "contain" as any,
    width: "100%",
    height: "100%",
  },
};

const UnderConstruction = () => {
  return (
    <div>
      <h5>
        <span data-uk-icon="icon: paint-bucket"></span> Under Constructions...
      </h5>
      <div className="image" style={style.image}>
        <img
          style={style.img}
          src={process.env.PUBLIC_URL + "/images/underconstruction.gif"}
          alt=""
          srcSet={process.env.PUBLIC_URL + "/images/underconstruction.gif"}
        />
      </div>
    </div>
  );
};

export default UnderConstruction;
