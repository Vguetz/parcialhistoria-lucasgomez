// src/lib/answers.ts

export const historyAnswers = {
  parte1: {
    titulo: "Análisis: Caricatura de Cao (Caras y Caretas)",
    preguntas: [
      {
        q: "1) Describí lo que ves en la imagen sin interpretarlo todavía...",
        a: "En esta imagen aparece como personaje José Batlle y Ordóñez, pero al verlo, la cara por alguna razón parece como demasiado alargada, los zapatos a su vez son muy largos y finitos, tiene una mirada como cansada o apagada no sabria distinguir. Esta apoyado en una silla que parece tener el escudo de Uruguay en el respaldo. La sombra como que no coincide mucho con el, esta agarrando el diario de El Dia en la mano. Como simbolos ademas de el escudo de Uruguay no me doy cuenta de otra simbologia o relación con animales. Hay texto en la imagen tanto en el diario como en la parte de abajo."
      },
      {
        q: "2) ¿En qué momento del período estudiado ubicas esta caricatura?...",
        a: "El personaje probablemente se encuentra representado en el periodo entre 1903 y 1907, ya que fue la primera presidencia de José Batlle y Ordóñez, y el diario que sostiene en la mano es 'El Día', un diario fundado por él mismo en 1886. Claramente el personaje es José Batlle y Ordóñez, fue tanto un político como un periodista y abogado. Era perteneciente al patriciado de Montevideo, por lo que su lugar en la política y su rol al llegar a la primera presidencia no fue una coincidencia, ya que su clase social le permitió acceder a la política."
      },
      {
        q: "3) ¿Qué te dice esta caricatura que una fuente escrita no te diría de la misma manera? ¿Cuáles son sus limitaciones como fuente histórica? ",
        a:"Probablemente esta caricatura nos muestra una imagen de José Batlle y Ordóñez que no es tan común en las fuentes escritas, como por ejemplo su expresión facial, su postura, su vestimenta, etc. Ya que lo pintan mas como un tipo 'ordinario', sentandose en su silla a leer el diario, asumo que eso es mas para que lo comparen con una persona mas del monton y generar confianza. Sin embargo, como fuente histórica tiene limitaciones ya que es una representación artística y subjetiva, por lo que puede estar influenciada por la opinión del caricaturista."
      },
      {
        q:"Leé con atención el texto que aparece al pie de la imagen. ¿Qué dice sobre la relación entre el personaje y el periódico El Día? ¿La frase es un elogio, una crítica o las dos cosas a la vez? ¿Cómo se relaciona con la imagen? ",
        a:"La imagen bien dice tanto en la frase de abajo como en el diario que el personaje es José Batlle y Ordóñez, y que el diario es 'El Día', un diario fundado por él mismo. La frase 'El Dia le dio renombre' habla de la importancia del diario en la carrera política de José Batlle y Ordóñez."
      }
    ]
  },
  parte2: {
    titulo: "La Guerra Civil de 1904 y Consolidación del Estado",
    preguntas: [
      {
        q: "1) ¿Cuáles fueron las causas principales de la guerra civil de 1904?",
        a: "Explicación de las causas..."
      },
      {
        q: "2) ¿Cómo vinculas el conflicto con la caricatura? ¿Qué es 'blanquear'?",
        a: "Acá analizas la frase 'Recién la estrenas y ya te la están blanqueando'..."
      }
    ]
  }
};

export type PartKey = keyof typeof historyAnswers;