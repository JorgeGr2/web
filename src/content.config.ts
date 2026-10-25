import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Guías en Markdown (src/content/guias/*.md). El nombre del archivo es la URL:
 * guias/fianza-alquiler.md → /guias/fianza-alquiler/
 */
const guias = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/guias' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().min(70).max(170),
    h1: z.string(),
    resumen: z.string(),
    publicado: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    actualizado: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    orden: z.number().default(100),
    /** Bloque temático en el índice de guías y para sugerir guías relacionadas. */
    categoria: z.enum(['renta', 'duracion', 'dinero', 'situaciones']),
    herramientas: z.array(z.string()).default([]),
    fuentes: z.array(z.object({ texto: z.string(), url: z.url() })).min(1),
  }),
});

export const collections = { guias };
