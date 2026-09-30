const Section = ({ id, children, border, compact = false }) => {
  const spacing = compact
    ? "py-12 px-6 md:px-12 md:py-16"
    : "pt-20 px-6 md:px-12 pb-20";
  return border ? (
    <section
      id={id}
      className={`${spacing} scroll-mt-16 border-b border-gray-200`}
    >
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  ) : (
    <section id={id} className={`${spacing} scroll-mt-16`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
};

export default Section;
