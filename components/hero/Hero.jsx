import { Reveal } from "@/components/ui/Reveal";
import { CompassRose } from "@/components/ui/CompassRose";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden px-6 pb-12 pt-16 sm:px-[60px] sm:pb-[66px] sm:pt-[88px]"
    >
      {/* Rosa de los vientos: pieza gráfica de fondo, no un ícono de marca */}
      <CompassRose className="pointer-events-none absolute right-[-60px] top-1/2 -z-10 h-[380px] w-[380px] -translate-y-1/2 opacity-[0.22] sm:right-[20px] sm:h-[440px] sm:w-[440px]" />

      <Reveal className="flex max-w-[900px] flex-col gap-6 sm:gap-[24px]">
        <h1
          id="hero-title"
          className="max-w-[15ch] text-[42px] font-extrabold leading-[0.98] tracking-[-0.03em] sm:text-[76px] sm:leading-[0.96] sm:tracking-[-0.045em]"
        >
          Un municipio, de principio a fin.
        </h1>
        <p className="max-w-[56ch] text-[16px] font-light leading-[1.55] text-[#A0A0AC] sm:text-[18.5px] sm:leading-[1.56]">
          Dos empresas, una misma oficina y un solo recorrido: primero se
          ordena la gestión, después se publica. Nadie entrega a medias
          porque nadie se queda a medio camino.
        </p>
      </Reveal>
    </section>
  );
}

export default Hero;
