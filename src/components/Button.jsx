import React from "react";

function Button({
  children, // children to be displayed inside the button
  type = "button",
  bgColor = "blue",
  textColor = "text-white",
  className = "",
  ...props
}) {
  return (
    <button
      className={`${className} ${type} ${bgColor} ${textColor} hover:scale-110 duration-100 ease-in`}
      {...props} // spread operator to pass any additional props
      // like onClick, disabled, etc.
    >
      {children}
    </button>
  );
}

export default Button;
