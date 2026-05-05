import React from "react";

export default function HeroFeatureCard({
  icon: Icon,
  title,
  text,
  onClick,
  as = "div",
}) {
  const Component = as;

  return (
    <Component
      onClick={onClick}
      className="group rounded-[1.6rem] border border-white/24 bg-white/50 p-4 text-left shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/66"
    >
      {Icon ? (
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-[rgba(245,166,35,0.14)] text-[#c46f04] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
          <Icon size={20} />
        </div>
      ) : null}

      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[#5f4a35]">{text}</p>
    </Component>
  );
}
