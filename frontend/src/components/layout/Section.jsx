const Section = ({ id, children, border }) => {
  return border ? (
    <section
      id={id}
      className='pt-20 px-6 md:px-12 pb-20 border-b border-gray-200'
    >
      <div className='max-w-6xl mx-auto'>{children}</div>
    </section>
  ) : (
    <section id={id} className='pt-20 px-6 md:px-12 pb-20'>
      <div className='max-w-6xl mx-auto'>{children}</div>
    </section>
  );
};

export default Section;
