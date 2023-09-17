/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_BACKEND_URL_PREFIX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
