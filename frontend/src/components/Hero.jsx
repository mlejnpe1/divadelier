import HeroBG from "../assets/images/heroBG.png";

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
      className='w-screen h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-20 bg-cover bg-center bg-gradient-to-r from-[#f5a623]/20 via-[#ffffff]/40 to-[#ffffff]'
      style={{
        height: "calc(100vh - 4rem)",
        backgroundImage: `url(${HeroBG})`,
      }}
    >
      {/* Text */}
      <div className='md:w-1/2 text-center md:text-left mb-10 md:mb-0'>
        <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
          {title}
        </h1>
        {subtitle && (
          <p className='text-white text-lg md:text-xl mb-6'>{subtitle}</p>
        )}
        {description && (
          <p
            className='text-white text-lg md:text-xl mb-6'
            style={{ whiteSpace: "pre-line" }}
          >
            {description}
          </p>
        )}
        {buttonText && (
          <a
            href={buttonLink || "#"}
            className='bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition'
          >
            {buttonText}
          </a>
        )}
      </div>

      <div className='md:w-1/2 w-full h-80 md:h-96 flex justify-center relative z-10'>
        {children}
      </div>
    </section>
  );
};

export default Hero;
