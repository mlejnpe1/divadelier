import { Link } from "react-router";

const baseClassName =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5a623] disabled:pointer-events-none disabled:opacity-60";

const variantClassNames = {
  primary:
    "bg-[#f5a623] text-white shadow-[0_16px_34px_rgba(245,166,35,0.28)] hover:-translate-y-0.5 hover:bg-[#e39a1b]",
  secondary:
    "border border-gray-200 bg-white text-gray-800 shadow-[0_10px_24px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:bg-gray-50",
};

const sizeClassNames = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3",
};

const radiusClassNames = {
  full: "rounded-full",
  soft: "rounded-2xl",
  xl: "rounded-xl",
};

function joinClassNames(...parts) {
  return parts.filter(Boolean).join(" ");
}

function isExternalHref(href) {
  return /^(https?:|mailto:|tel:|#|\/\/)/.test(href);
}

export default function Button({
  type = "button",
  to,
  href,
  target,
  rel,
  children,
  variant = "primary",
  size = "md",
  radius = "full",
  fullWidth = false,
  className = "",
  ...props
}) {
  const classNames = joinClassNames(
    baseClassName,
    variantClassNames[variant] || variantClassNames.primary,
    sizeClassNames[size] || sizeClassNames.md,
    radiusClassNames[radius] || radiusClassNames.full,
    fullWidth ? "w-full" : "",
    className,
  );

  if (to) {
    return (
      <Link to={to} className={classNames} {...props}>
        {children}
      </Link>
    );
  }

  if (href && !target && !rel && !isExternalHref(href)) {
    return (
      <Link to={href} className={classNames} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={classNames} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classNames} {...props}>
      {children}
    </button>
  );
}
