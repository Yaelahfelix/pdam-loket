import React from "react";

type SignatureProps = {
  position?: string;
  name?: string;
  showDate?: boolean;
};

const Signature: React.FC<SignatureProps> = ({ position, name }) => {
  return (
    <div
      className="w-full text-center mt-8"
      style={{
        // fontFamily: "Arial, sans-serif",
        fontSize: "12px",
      }}
    >
      <div className="mb-2">Mengetahui</div>
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
