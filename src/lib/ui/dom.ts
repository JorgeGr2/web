/**
 * Utilidades de interfaz para las calculadoras (se ejecutan en el navegador).
 *
 * Seguridad: todo el texto se inserta con textContent o como nodos de texto;
 * nunca se usa innerHTML con datos introducidos por la persona.
 */
import type { Aviso, ErrorCampo } from '../calc/tipos';
import type { Fuente } from '../../data/normativa';
import { leerNumero } from '../formato';
import { esFechaIso } from '../fechas';

type Child = Node | string | number | null | undefined | false;
type Attrs = Record<string, string | number | boolean | undefined | null>;

/** Crea un elemento DOM de forma segura. */
export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Attrs = {}, ...children: Child[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') el.className = String(v);
    else el.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of children) {
    if (c === null || c === undefined || c === false) continue;
    el.append(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
  }
  return el;
}

function campo(form: HTMLFormElement, name: string): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null {
  const el = form.elements.namedItem(name);
  if (el instanceof RadioNodeList) return null;
  return el as HTMLInputElement | null;
}

export function leerTexto(form: HTMLFormElement, name: string): string {
  return campo(form, name)?.value.trim() ?? '';
}

export function leerNum(form: HTMLFormElement, name: string): number | null {
  return leerNumero(leerTexto(form, name));
}

export function leerFecha(form: HTMLFormElement, name: string): string {
  const v = leerTexto(form, name);
  return esFechaIso(v) ? v : '';
}

export function leerRadio<T extends string>(form: HTMLFormElement, name: string): T | null {
  const checked = form.querySelector<HTMLInputElement>(`input[name="${CSS.escape(name)}"]:checked`);
  return (checked?.value as T) ?? null;
}

/** Quita errores previos del formulario. */
export function limpiarErrores(form: HTMLFormElement): void {
  form.querySelectorAll('[aria-invalid="true"]').forEach((el) => el.removeAttribute('aria-invalid'));
  form.querySelectorAll<HTMLElement>('.field-error').forEach((el) => (el.textContent = ''));
  const resumen = form.querySelector<HTMLElement>('[data-error-summary]');
  if (resumen) {
    resumen.hidden = true;
    resumen.replaceChildren();
  }
}

/** Muestra errores junto a cada campo y un resumen enlazado al principio del formulario. */
export function mostrarErrores(form: HTMLFormElement, errores: ErrorCampo[]): void {
  limpiarErrores(form);
  const items: HTMLLIElement[] = [];
  for (const e of errores) {
    const inputs = form.querySelectorAll<HTMLElement>(`[name="${CSS.escape(e.campo)}"]`);
    inputs.forEach((i) => i.setAttribute('aria-invalid', 'true'));
    const msg = form.querySelector<HTMLElement>(`#${CSS.escape(e.campo)}-error`);
    if (msg) msg.textContent = e.mensaje;
    const target = inputs[0]?.id ? `#${inputs[0].id}` : '#';
    items.push(h('li', {}, h('a', { href: target }, e.mensaje)));
  }
  const resumen = form.querySelector<HTMLElement>('[data-error-summary]');
  if (resumen) {
    resumen.replaceChildren(h('h2', { tabindex: '-1' }, 'Revisa estos datos'), h('ul', {}, ...items));
    resumen.hidden = false;
    resumen.querySelector<HTMLElement>('h2')?.focus();
  }
}

export function renderAvisos(avisos: Aviso[]): HTMLElement[] {
  const titulos = { info: 'Para tener en cuenta', aviso: 'Atención', importante: 'Importante' } as const;
  return avisos.map((a) =>
    h('div', { class: `callout callout--${a.nivel}` }, h('p', { class: 'callout__title' }, titulos[a.nivel]), h('p', {}, a.texto)),
  );
}

export function renderFundamentos(fuentes: Fuente[]): HTMLElement {
  const unicas = fuentes.filter((f, i, arr) => arr.findIndex((x) => x.url === f.url) === i);
  return h(
    'div',
    { class: 'sources' },
    h('h3', {}, 'Base legal y datos'),
    h('ul', {}, ...unicas.map((f) => h('li', {}, h('a', { href: f.url, target: '_blank', rel: 'noopener' }, f.texto)))),
  );
}

export function kv(pares: Array<[string, string]>): HTMLDListElement {
  const dl = h('dl', { class: 'kv' });
  for (const [k, v] of pares) dl.append(h('dt', {}, k), h('dd', {}, v));
  return dl;
}

export function cifra(etiqueta: string, valor: string, sub?: string): HTMLElement {
  return h(
    'div',
    { class: 'result-figure' },
    h('span', { class: 'result-figure__label' }, etiqueta),
    h('span', { class: 'result-figure__value' }, valor),
    sub ? h('span', { class: 'result-figure__sub' }, sub) : null,
  );
}

/** Rellena el panel de resultados y mueve el foco a su título. */
export function pintarResultado(panel: HTMLElement, titulo: string, ...contenido: Child[]): void {
  const h2 = h('h2', { tabindex: '-1', id: `${panel.id}-titulo` }, titulo);
  panel.replaceChildren(h2, ...contenido.filter((c): c is Node | string => Boolean(c) || c === ''));
  panel.dataset.state = 'filled';
  // En móvil el resultado queda debajo: lo llevamos a la vista.
  h2.focus({ preventScroll: true });
  if (window.matchMedia('(max-width: 61.99rem)').matches) {
    h2.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }
}

/** Guarda los valores del formulario en la URL para poder compartir el cálculo. */
export function guardarEnUrl(form: HTMLFormElement): void {
  const params = new URLSearchParams();
  for (const el of Array.from(form.elements)) {
    if (!(el instanceof HTMLInputElement || el instanceof HTMLSelectElement)) continue;
    if (!el.name || el.dataset.noShare !== undefined) continue;
    if (el instanceof HTMLInputElement && (el.type === 'radio' || el.type === 'checkbox') && !el.checked) continue;
    if (el.value.trim() === '') continue;
    params.set(el.name, el.value.trim());
  }
  const qs = params.toString();
  cambiarUrl(`${location.pathname}${qs ? `?${qs}` : ''}`);
}

/**
 * Cambia la URL sin recargar. Algunos marcos protegidos (iframes con
 * sandbox) no permiten tocar el historial: en ese caso se ignora y el
 * cálculo sigue funcionando.
 */
export function cambiarUrl(url: string): void {
  try {
    history.replaceState(null, '', url);
  } catch {
    /* sin historial disponible: no es imprescindible */
  }
}

/** Restaura valores desde la URL. Devuelve true si había alguno. */
export function restaurarDesdeUrl(form: HTMLFormElement): boolean {
  const params = new URLSearchParams(location.search);
  let alguno = false;
  params.forEach((value, name) => {
    const val = value.slice(0, 300);
    const radios = form.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${CSS.escape(name)}"]`);
    if (radios.length) {
      radios.forEach((r) => (r.checked = r.value === val));
      alguno = true;
      return;
    }
    const el = form.elements.namedItem(name);
    if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
      if (el.dataset.noShare !== undefined) return;
      el.value = val;
      alguno = true;
    }
  });
  return alguno;
}

export async function copiarTexto(texto: string): Promise<boolean> {
  try {
    if (!navigator.clipboard) return false;
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}

export function descargarTexto(nombre: string, texto: string): void {
  const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: nombre });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Conecta un formulario de calculadora: al enviar, valida y pinta; restaura
 * desde la URL al cargar; y el botón "Restablecer" limpia todo.
 */
export function conectarCalculadora(form: HTMLFormElement, panel: HTMLElement, calcular: () => void): void {
  const vacio = panel.cloneNode(true) as HTMLElement;
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    calcular();
  });
  form.addEventListener('reset', () => {
    setTimeout(() => {
      limpiarErrores(form);
      panel.replaceChildren(...Array.from(vacio.cloneNode(true).childNodes));
      panel.dataset.state = 'empty';
      cambiarUrl(location.pathname);
      form.dispatchEvent(new Event('change'));
    });
  });
  if (restaurarDesdeUrl(form)) {
    form.dispatchEvent(new Event('change'));
    calcular();
  }
}
