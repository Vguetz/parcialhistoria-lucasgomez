// src/app/articulo/page.tsx
export default function Articulo1904() {
  return (
    <main className="max-w-5xl mx-auto p-8 font-serif">
      {/* Cabecera del Diario */}
      <header className="border-b-4 border-[var(--ink-dark)] pb-4 mb-8 text-center">
        <h1 className="text-6xl font-black uppercase tracking-widest font-[family-name:var(--font-playfair)]">
          El Día
        </h1>
        <div className="flex justify-between border-y-2 border-[var(--ink-dark)] py-1 mt-4 text-sm font-[family-name:var(--font-courier)] uppercase">
          <span>Montevideo, 1904</span>
          <span>Edición Especial</span>
          <span>Precio: 2 Centésimos</span>
        </div>
      </header>

      {/* Grilla estilo periódico */}
      <article className="grid grid-cols-1 md:grid-cols-3 gap-8 text-justify">
        <div className="col-span-2">
          <h2 className="text-3xl font-bold mb-4">
            Titular sobre la Guerra Civil o Reformas
          </h2>
          {/* La clase first-letter crea la capitular clásica */}
          <p className="first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2">
            Acá vas a redactar tu artículo periodístico para la Parte 4...
          </p>
        </div>
        <aside className="border-l-2 border-[var(--ink-dark)] pl-8">
          <h3 className="text-xl font-bold italic mb-2">Columna de opinión</h3>
          <p>Texto secundario o detalles adicionales de la época...</p>
        </aside>
      </article>
    </main>
  );
}
