import type { Fuente } from '../../data/normativa';

export type NivelAviso = 'info' | 'aviso' | 'importante';

export interface Aviso {
  nivel: NivelAviso;
  texto: string;
}

/** Error de validación ligado a un campo del formulario. */
export interface ErrorCampo {
  campo: string;
  mensaje: string;
}

export type ResultadoValidacion<T> = { ok: true; valor: T } | { ok: false; errores: ErrorCampo[] };

export type { Fuente };
