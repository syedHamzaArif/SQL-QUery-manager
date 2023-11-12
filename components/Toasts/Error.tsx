import React from "react";

const Error = ({ message }: { message: string }) => (
  <div className="flex">
    <div className="mr-5">
      <span className="material-icons">close</span>
    </div>
    <p className="mr-5">{message}</p>
  </div>
);

export default Error;
