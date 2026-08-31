const CIFRAS = [
  {
    valor: "36%",
    color: "var(--color-amplia)",
    leyenda: "de los municipios de Sonora ha trabajado con Amplía",
    padding: "py-[34px] pl-6 pr-6 sm:pl-[60px] sm:pr-[30px]",
  },
  {
    valor: "14",
    color: "var(--color-glow)",
    leyenda: "portales municipales en vivo, en su propio dominio",
    padding: "px-6 py-[34px] sm:px-[30px]",
  },
  {
    valor: "10",
    color: "var(--color-text)",
    leyenda: "ayuntamientos que ya recorrieron el camino completo",
    padding: "py-[34px] pl-6 pr-6 sm:pl-[30px] sm:pr-[60px]",
  },
];

/**
 * La prueba: franja de tres cifras con separadores de 1px logrados por el
 * gap del grid, no por bordes — así el fondo #08090B de cada celda llega
 * hasta el borde y solo la línea de fondo #17171E asoma entre ellas.
 * Se apila a una columna en móvil; C solo muestra el ancho de escritorio.
 */
export function Prueba() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-px border-y border-[#17171E] bg-[#17171E] sm:mt-[24px] sm:grid-cols-3">
      {CIFRAS.map((c) => (
        <div
          key={c.valor}
          className={`flex flex-col gap-[7px] bg-[var(--color-bg)] ${c.padding}`}
        >
          <span
            className="font-display text-[42px] font-bold leading-none"
            style={{ color: c.color }}
          >
            {c.valor}
          </span>
          <span className="text-[13.5px] font-light text-[#7A7A88]">
            {c.leyenda}
          </span>
        </div>
      ))}
    </div>
  );
}

export default Prueba;
