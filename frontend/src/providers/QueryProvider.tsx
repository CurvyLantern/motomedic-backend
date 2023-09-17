import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export const qc = new QueryClient();
export type qc = typeof qc;
const QueryProvider: CompWithChildren = ({ children }) => {
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};

export default QueryProvider;
