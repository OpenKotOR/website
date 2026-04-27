/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public Hugging Face Space mirror (OldRepublicDevs/site → oldrepublicdevs-site.static.hf.space). */
  readonly VITE_HF_MIRROR_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.json' {
  const value: unknown;
  export default value;
}

