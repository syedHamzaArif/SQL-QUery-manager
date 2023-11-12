import React from "react";

const Success = ({ message }: { message: string }) => (
  <div className="flex">
    <div className="mr-5">
      <span className="material-icons">done</span>
    </div>
    <p className="mr-5">{message}</p>
  </div>
);

export default Success;
