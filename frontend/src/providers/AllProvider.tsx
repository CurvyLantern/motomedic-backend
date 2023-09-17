import QueryProvider from "./QueryProvider";
import StoreProvider from "./StoreProvider";
import ThemeProvider from "./ThemeProvider";

const AllProvider: CompWithChildren = ({ children }) => {
  return (
    <QueryProvider>
      <StoreProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </StoreProvider>
    </QueryProvider>
  );
};

export default AllProvider;
