const Hero = ({
  title,
  subtitle,
  description,
  buttonText,
  buttonLink,
  children,
}) => {
  return (
    <section
      className='bg-gray-50 flex flex-col md:flex-row items-center justify-center px-6 md:px-20 bg-gradient-to-r from-[#f5a623]/20 via-[#ffffff]/40 to-[#ffffff]'
      style={{ height: "calc(100vh - 4rem)" }}
    >
      {/* Text */}
      <div className='md:w-1/2 text-center md:text-left mb-10 md:mb-0'>
        <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
          {title}
        </h1>
        {subtitle && (
          <p className='text-gray-600 text-lg md:text-xl mb-6'>{subtitle}</p>
        )}
        {description && (
          <p className='text-gray-600 text-lg md:text-xl mb-6'>{description}</p>
        )}
        {buttonText && (
          <a
            href={buttonLink || "#"}
            className='bg-[#f5a623] text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-500 transition'
          >
            {buttonText}
          </a>
        )}
      </div>

      {/* Children (např. image rotator nebo cokoliv jiného) */}
      <div className='md:w-1/2 h-auto flex justify-center z-10'>{children}</div>
    </section>
  );
};

export default Hero;
