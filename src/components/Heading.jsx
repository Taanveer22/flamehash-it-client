// Shades of #0A2239, from darkest to lightest.
// Change these three values to shift the gradient's mood.
const SHADES = {
  base: "#0A2239", // the color you gave — darkest point
  mid: "#1D4C78", // a medium step in between
  light: "#5FA8D3", // a lighter, brighter version — gives the "radiant" glow
};

export default function Heading({ title, description }) {
  return (
    <>
      <h1
        className="text-center text-3xl sm:text-4xl font-semibold tracking-tight  bg-clip-text text-transparent"
        style={{
          backgroundImage: `linear-gradient(to right, ${SHADES.base}, ${SHADES.mid}, ${SHADES.light})`,
        }}
      >
        {title}
      </h1>

      <p className="mx-auto my-4 max-w-2xl text-center text-sm leading-relaxed text-slate-500 sm:text-base">
        {description}
      </p>
    </>
  );
}