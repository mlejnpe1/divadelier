import HeroBG from "../../assets/images/heroBG.png";
import HeroBG1 from "../../assets/images/heroBG1.webp";
import HeroBG2 from "../../assets/images/heroBG2.webp";
import HeroBG3 from "../../assets/images/heroBG3.webp";
import Button from "./Button";

const Hero = ({
  title,
  subtitle,
  description,
  buttonText,
  buttonLink,
  onButtonClick,
  children,
}) => {
  const hasChildren = Boolean(children);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "calc(100vh - 4rem)",
        backgroundImage: `url(${HeroBG3})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#5a3900]/65 via-[#8a5a11]65 to-[#f4efe8]/25" />
      {/* Decorative glow */}
      <div className="pointer-events-none absolute right-[-6rem] top-1/2 h-[26rem] w-[26rem] -translate-y-1/2 rounded-full bg-orange-300/20 blur-3xl" />
      <div className="pointer-events-none absolute left-[-4rem] bottom-[-4rem] h-56 w-56 rounded-full bg-amber-200/10 blur-3xl" />

      <div
        className={`relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1440px] flex-col items-center justify-center gap-12 px-6 py-12 md:gap-16 md:px-10 lg:gap-20 lg:px-16 ${
          hasChildren ? "md:flex-row" : ""
        }`}
      >
        {/* Left side */}
        <div className={`w-full ${hasChildren ? "md:w-[46%]" : "max-w-4xl"}`}>
          <div
            className={`max-w-3xl text-center ${
              hasChildren ? "md:text-left" : "mx-auto"
            }`}
          >
            {subtitle && (
              <p className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-orange-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                {subtitle}
              </p>
            )}

            <h1 className="mb-6 text-4xl font-bold leading-[1.05] text-white/95 md:text-6xl">
              {title}
            </h1>

            {description && (
              <div className="mb-8 text-lg leading-8 text-white/90">
                {description}
              </div>
            )}

            {buttonText && buttonLink && (
              <Button href={buttonLink}>{buttonText}</Button>
            )}

            {buttonText && onButtonClick && !buttonLink && (
              <Button onClick={onButtonClick}>{buttonText}</Button>
            )}
          </div>
        </div>

        {hasChildren && (
          <div className="flex w-full items-center justify-center md:w-[54%]">
            <div className="relative w-full max-w-[900px]">
              <div className="pointer-events-none absolute inset-6 rounded-[3rem] bg-orange-300/16 blur-3xl md:inset-4" />
              <div className="relative w-full">{children}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
