import React from "react";

export const Button = ({
  children,
  className = "",
  variant = "primary",
  ...props
}) => {
  let base =
    "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";

  let styles = "";

  switch (variant) {
    case "outline":
      styles =
        "border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white focus:ring-gray-700";
      break;

    case "glow":
      styles =
        "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(147,51,234,0.7)]";
      break;

    default:
      styles =
        "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/50";
  }

  return (
    <button
      className={`${base} ${styles} ${className} px-6 py-3 text-lg`}
      {...props}
    >
      {children}
    </button>
  );
};
