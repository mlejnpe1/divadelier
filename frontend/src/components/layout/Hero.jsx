import HeroBG1 from "../../assets/images/heroBG1.webp";

const Hero = ({
  title,
  subtitle,
  description,
  buttonText,
  buttonLink,
  onButtonClick,
  children,
}) => {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "calc(100vh - 4rem)",
        backgroundImage: `url(${HeroBG1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#5a3900]/85 via-[#8a5a11]/65 to-[#f4efe8]/55" />
      {/* Decorative glow */}
      <div className="pointer-events-none absolute right-[-6rem] top-1/2 h-[26rem] w-[26rem] -translate-y-1/2 rounded-full bg-orange-300/20 blur-3xl" />
      <div className="pointer-events-none absolute left-[-4rem] bottom-[-4rem] h-56 w-56 rounded-full bg-amber-200/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1440px] flex-col items-center justify-center gap-12 px-6 py-12 md:flex-row md:gap-16 md:px-10 lg:gap-20 lg:px-16">
        {/* Left side */}
        <div className="w-full md:w-[46%]">
          <div className="max-w-3xl text-center md:text-left">
            {subtitle && (
              <p className="mb-5 text-sm font-medium uppercase tracking-[0.22em] text-orange-300">
                {subtitle}
              </p>
            )}

            <h1 className="mb-6 text-4xl font-bold leading-[1.05] text-white md:text-6xl">
              {title}
            </h1>

            {description && (
              <div className="mb-8 text-lg leading-8 text-white/90">
                {description}
              </div>
            )}

            {buttonText && buttonLink && (
              <a
                href={buttonLink}
                className="inline-flex items-center justify-center rounded-full bg-orange-500 px-7 py-3 font-semibold text-white shadow-lg shadow-orange-500/25 transition duration-300 hover:-translate-y-0.5 hover:bg-orange-400"
              >
                {buttonText}
              </a>
            )}

            {buttonText && onButtonClick && !buttonLink && (
              <button
                onClick={onButtonClick}
                className="inline-flex items-center justify-center rounded-full bg-orange-500 px-7 py-3 font-semibold text-white shadow-lg shadow-orange-500/25 transition duration-300 hover:-translate-y-0.5 hover:bg-orange-400"
              >
                {buttonText}
              </button>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex w-full md:w-[54%] items-center justify-center">
          <div className="relative w-full max-w-[900px]">
            {/* Glow */}
            <div className="absolute -inset-7 rounded-[3rem] bg-orange-300/20 blur-3xl" />

            {/* Big panel */}
            <div className="relative flex items-center justify-center rounded-[3rem] border border-white/10 bg-white/10 p-5 md:p-6 lg:p-7 shadow-[0_40px_100px_rgba(0,0,0,0.35)] backdrop-blur-md">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
