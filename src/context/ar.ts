import { createContext, useContext } from "react";
import type { Product } from "@/data/products";

export interface ARContextValue {
  openAR: (product: Product) => void;
}

export const ARContext = createContext<ARContextValue>({ openAR: () => {} });

export const useAR = () => useContext(ARContext);
