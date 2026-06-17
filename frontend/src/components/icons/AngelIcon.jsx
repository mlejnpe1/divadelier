import React from "react";

export default function AngelIcon({ className = "", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <ellipse
        cx="12"
        cy="4.1"
        rx="3.7"
        ry="1.05"
        stroke="currentColor"
        strokeWidth="1.55"
      />

      <circle
        cx="12"
        cy="8.35"
        r="2"
        fill="#FFFDFB"
        stroke="currentColor"
        strokeWidth="1.55"
      />

      <path
        d="M12 10.2c-1.8 0-3.3 1.3-3.5 3.1l-.5 4c-.1.8-.4 1.5-.9 2.2l-.7.8c-.4.5-.1 1.2.5 1.2h10.2c.6 0 .9-.7.5-1.2l-.7-.8c-.5-.6-.8-1.4-.9-2.2l-.5-4c-.2-1.8-1.7-3.1-3.5-3.1Z"
        fill="#FFFDFB"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="round"
      />

      <path
        d="M10 11.4c-2.7-2.6-5.7-3.2-7.4-1.9-1 .8-1.3 2.1-.7 3.2.4.7 1.1 1.2 1.9 1.4-.7.7-1 1.7-.7 2.5.4.9 1.1 1.4 2 1.5-.4.8-.3 1.7.3 2.3.7.8 1.8 1 2.8.6.8-.3 1.4-.8 1.9-1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M14 11.4c2.7-2.6 5.7-3.2 7.4-1.9 1 .8 1.3 2.1.7 3.2-.4.7-1.1 1.2-1.9 1.4.7.7 1 1.7.7 2.5-.4.9-1.1 1.4-2 1.5.4.8.3 1.7-.3 2.3-.7.8-1.8 1-2.8.6-.8-.3-1.4-.8-1.9-1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M8.8 14.2c.8.5 1.6.8 2.4.8.5 0 1-.1 1.5-.4.5.3 1 .4 1.5.4.8 0 1.6-.3 2.4-.8"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
    </svg>
  );
}
