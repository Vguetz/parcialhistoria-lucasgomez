// src/app/articulo/page.tsx
import Image from "next/image";

export default function Articulo1904() {
  return (
    <main className="p-8 font-serif bg-[#f4f1ea] text-stone-900 shadow-2xl">
      {/* Cabecera del Diario */}
      <header className="border-b-4 border-stone-900 pb-4 mb-8 text-center">
        <h1 className="text-7xl font-black uppercase tracking-widest font-[family-name:var(--font-playfair)]">
          El Día
        </h1>
        <div className="flex justify-between border-y-2 border-stone-900 py-1 mt-4 text-sm font-[family-name:var(--font-courier)] uppercase font-bold">
          <span>Montevideo, 15 de Septiembre de 1904</span>
          <span>Edición Especial</span>
          <span>Precio: 2 Centésimos</span>
          <span>Escrito por: Lucas Gomez</span>
        </div>
      </header>

      {/* Grilla estilo periódico */}
      <article className="grid grid-cols-1 md:grid-cols-3 gap-8 text-justify">
        <div className="col-span-2">
          {/* Titulares con más peso visual */}
          <h2 className="text-4xl font-black mb-2 border-b-2 border-stone-300 pb-2">
            ¡EL TRIUNFO DE LA LEY SOBRE LA BARBARIE!
          </h2>
          <h3 className="text-2xl italic mb-6 text-stone-700">
            La República respira en paz: el Estado afirma su autoridad
          </h3>

          {/* Contenedor de la Imagen */}
          <figure className="mb-6 border-b border-stone-400 pb-4">
            <div className="relative w-full aspect-video border-4 border-double border-stone-800 p-1 bg-stone-300">
              <Image
                src="/batalla.png"
                alt="Grabado de la Batalla de Masoller"
                fill
                className="object-cover grayscale contrast-125 sepia-[.20] mix-blend-multiply"
              />
            </div>
            <figcaption className="text-xs text-center mt-2 font-[family-name:var(--font-courier)] uppercase tracking-widest text-stone-600 font-bold">
              Fuerzas regulares dispersando el avance insurrecto en las
              cuchillas de Masoller.
            </figcaption>
          </figure>

          {/* Texto de la noticia */}
          <p className="first-letter:text-6xl first-letter:font-black first-letter:float-left first-letter:mr-3 mb-4 leading-relaxed">
            La jornada de Masoller ha sellado definitivamente el destino de
            nuestra Patria. Las fuerzas leales a la Constitución, enviadas por
            el Presidente de la República, han logrado dispersar a los ejércitos
            rebeldes que, ciegos de pasiones arcaicas, pretendían mantener al
            país sumido en el atraso y dividido en feudos.
          </p>
          <p className="mb-4 leading-relaxed">
            El lamentable deceso del caudillo revolucionario no es más que la
            triste consecuencia de haberse alzado contra el orden institucional
            y el sufragio. ¿Por qué hemos tenido que llegar al derramamiento de
            sangre hermana? Porque el progreso no negocia con la insurrección.
            No puede haber dos patrias, ni dos gobiernos, ni dos ejércitos
            dentro de nuestras fronteras.
          </p>
        </div>

        {/* Columna Editorial */}
        <aside className="border-l-2 border-stone-900 pl-8 bg-stone-100/50 py-2">
          <h3 className="text-xl font-black uppercase tracking-widest border-b-2 border-stone-900 pb-2 mb-4">
            Editorial: Nuestra Posición
          </h3>
          <p className="mb-4 text-sm leading-relaxed">
            Desde estas páginas siempre lo hemos sostenido: con la victoria de
            las fuerzas regulares no ha triunfado una divisa,{" "}
            <span className="font-black uppercase">
              HA TRIUNFADO LA CIVILIZACIÓN.
            </span>{" "}
            El obscurantismo de las cuchillas ha cedido ante la fuerza de la
            ley.
          </p>
          <p className="text-sm leading-relaxed">
            Ahora, con el país pacificado, el Estado podrá dedicar todas sus
            energías a la verdadera obra. Llegó la hora de la justicia social,
            de amparar a las clases laboriosas, de expandir la educación pública
            y de cimentar nuestra independencia económica. El caudillismo ha
            muerto; ¡es la hora de los ciudadanos!
          </p>
        </aside>
      </article>
    </main>
  );
}
