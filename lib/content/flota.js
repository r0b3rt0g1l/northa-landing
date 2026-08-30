// Los 14 municipios en producción. Fuente autoritativa de slug/dominio:
// ~/Developer/cmsmunicipal/scripts/flota/flota.config.json (único lugar donde se declara
// la flota). `amplia:true` verificado a mano contra las láminas 15-17 de
// ~/Developer/_material-amplia/ ("Ayuntamientos que respaldan nuestra labor profesional").
export const flota = [
  { slug: "aconchi", nombre: "Aconchi", dominio: "www.aconchitransparencia.com.mx", amplia: true },
  { slug: "bacadehuachi", nombre: "Bacadéhuachi", dominio: "bacadehuachitransparencia.com.mx", amplia: true },
  { slug: "bacanora", nombre: "Bacanora", dominio: "bacanoratransparencia.com.mx", amplia: true },
  { slug: "banamichi", nombre: "Banámichi", dominio: "www.banamichitransparencia.com.mx", amplia: false },
  { slug: "baviacora", nombre: "Baviácora", dominio: "baviacoratransparencia.com.mx", amplia: false },
  { slug: "carbo", nombre: "Carbó", dominio: "carbotransparencia.com.mx", amplia: true },
  { slug: "cucurpe", nombre: "Cucurpe", dominio: "cucurpetransparencia.com.mx", amplia: false },
  { slug: "huachinera", nombre: "Huachinera", dominio: "www.huachineratransparencia.com.mx", amplia: false },
  { slug: "mazatan", nombre: "Mazatán", dominio: "mazatantransparencia.com.mx", amplia: true },
  { slug: "rayon", nombre: "Rayón", dominio: "www.rayontransparencia.com.mx", amplia: true },
  { slug: "sahuaripa", nombre: "Sahuaripa", dominio: "sahuaripatransparencia.com.mx", amplia: true },
  { slug: "sanjavier", nombre: "San Javier", dominio: "sanjaviertransparencia.com.mx", amplia: true },
  { slug: "soyopa", nombre: "Soyopa", dominio: "www.soyopatransparencia.com.mx", amplia: true },
  { slug: "tepache", nombre: "Tepache", dominio: "www.tepachetransparencia.com.mx", amplia: true },
];

export default flota;
