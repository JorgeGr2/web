/** Bloques temáticos de las guías, en el orden en que se muestran. */
export const CATEGORIAS_GUIAS = [
  { id: 'renta', titulo: 'Subida de la renta', intro: 'Qué índice se aplica, cuánto puede subir y cómo se comunica.' },
  { id: 'duracion', titulo: 'Duración, prórrogas y fin del contrato', intro: 'Cuánto dura el contrato, cuándo se puede terminar y cómo dejar la vivienda.' },
  { id: 'dinero', titulo: 'Fianza, gastos y reparaciones', intro: 'Quién paga cada cosa y cómo recuperar la fianza.' },
  { id: 'situaciones', titulo: 'Contrato y situaciones especiales', intro: 'Qué firmar y qué pasa si se vende la vivienda, se subarrienda o fallece el inquilino.' },
] as const;

export type CategoriaGuia = (typeof CATEGORIAS_GUIAS)[number]['id'];
