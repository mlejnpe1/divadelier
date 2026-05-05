import React from "react";

function joinClassNames(...parts) {
  return parts.filter(Boolean).join(" ");
}

export default function HeroFeaturePanel({
  eyebrow,
  title,
  description,
  items = [],
  columnsClassName = "md:grid-cols-3",
  renderItem,
}) {
  return (
    <div className="w-full max-w-3xl">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/18 bg-[linear-gradient(145deg,rgba(255,248,236,0.84),rgba(255,232,190,0.36))] p-6 shadow-[0_28px_75px_rgba(60,28,0,0.22)] backdrop-blur-xl md:p-7">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/28 blur-3xl" />
        <div className="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-[#f5a623]/20 blur-3xl" />

        <div className="relative">
          {eyebrow ? (
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#9a590b]">
              {eyebrow}
            </p>
          ) : null}

          {title ? (
            <h2 className="mt-3 text-3xl font-bold leading-tight text-[#3f250f]">
              {title}
            </h2>
          ) : null}

          {description ? (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f4126]">
              {description}
            </p>
          ) : null}

          {items.length > 0 ? (
            <div
              className={joinClassNames(
                "mt-6 grid gap-4",
                columnsClassName,
              )}
            >
              {items.map((item, index) =>
                renderItem ? (
                  <React.Fragment key={item.id || item.title || index}>
                    {renderItem(item, index)}
                  </React.Fragment>
                ) : null,
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
