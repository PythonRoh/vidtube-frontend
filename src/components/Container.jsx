import React from "react";

// Container component to wrap children elements
// It provides a full width and responsive padding
function Container({ children }) {
  return <div className="w-full sm:px-2">{children}</div>;
}

export default Container;
