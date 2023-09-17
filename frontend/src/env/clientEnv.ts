if (!import.meta.env.VITE_BACKEND_URL) {
  throw new Error("No backend url defined");
}
export const clientEnv = {
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  prefix: {
    api: import.meta.env.VITE_BACKEND_URI_PREFIX_API ?? "",
    web: import.meta.env.VITE_BACKEND_URI_PREFIX_WEB ?? "",
  },
};
