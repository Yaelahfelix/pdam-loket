import React from "react";

type SignatureProps = {
  position?: string;
  name?: string;
  description?: string;
};

const Signature: React.FC<SignatureProps> = ({
  position,
  name,
  description,
}) => {
  return (
    <div
      className="text-center"
      style={{
        // fontFamily: "Arial, sans-serif",
        fontSize: "12px",
        pageBreakInside: "avoid",
        breakInside: "avoid",
        breakAfter: "auto",
        breakBefore: "auto",
      }}
    >
      <div className="mb-2">{description}</div>
      <div className="mb-4">{position}</div>

      <div
        className="border-t border-black pt-2 inline-block"
        style={{
          minWidth: "250px",
          marginTop: "50px",
          borderTopWidth: "1px",
          borderTopStyle: "solid",
        }}
      >
        {name}
      </div>
    </div>
  );
};

export default Signature;
