import { Provider } from "react-redux";
import { store } from "@/store/mainStore";
const StoreProvider: CompWithChildren = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
