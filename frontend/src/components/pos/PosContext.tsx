import { CompWithChildren } from "@/types/defaultTypes";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TCartProduct } from "./PosCartProduct";
import { getPercentage } from "./PosCart";

type TPosContextValue = {
  cartProducts: TCartProduct[];
  setCartProducts: React.Dispatch<React.SetStateAction<TCartProduct[]>>;
  removeCartProduct: (sku: string) => void;
  addToCart: (p: TCartProduct) => void;
  resetCart: () => void;
};
const initialValue: TPosContextValue = {
  cartProducts: [],
  setCartProducts: () => {},
  removeCartProduct: () => {},
  addToCart: () => {},
  resetCart: () => {},
};
const PosContext = createContext(initialValue);

export const usePosContext = () => useContext(PosContext);

export const PosContextProvider: CompWithChildren = ({ children }) => {
  const [baseCartProduct, setBaseCartProducts] = useState<TCartProduct[]>([]);
  const removeCartProduct = useCallback((sku: string) => {
    setBaseCartProducts((prev) => {
      const filtered = prev.filter((p) => p.sku !== sku);
      return [...filtered];
    });
  }, []);

  const addToCart = useCallback((p: TCartProduct) => {
    setBaseCartProducts((prev) => [...prev, p]);
  }, []);

  const cartProducts = useMemo(() => {
    const arr = baseCartProduct.map((p) => {
      const baseTotal = p.unit_price * p.quantity;
      if (p.discountType === "flat") {
        p.total_price = baseTotal - p.discount;
      } else {
        p.total_price = baseTotal - getPercentage(p.discount, baseTotal);
      }
      return p;
    });
    return arr;
  }, [baseCartProduct]);

  const resetCart = useCallback(() => {
    setBaseCartProducts([]);
  }, []);

  return (
    <PosContext.Provider
      value={{
        cartProducts,
        setCartProducts: setBaseCartProducts,
        resetCart,
        removeCartProduct,
        addToCart,
      }}
    >
      {children}
    </PosContext.Provider>
  );
};
