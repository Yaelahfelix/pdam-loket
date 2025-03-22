import { DRD, TotalDRD } from "@/types/drd";
import { create } from "zustand";

interface LPPRekAir {
  data: DRD[];
  total: TotalDRD;
}
type Store = {
  drd?: LPPRekAir;
  setDrd: (newDrd?: LPPRekAir) => void;
};

export const useLPPRekAirStore = create<Store>((set) => ({
  drd: undefined,

  setDrd: (newDrd) => set({ drd: newDrd }),
}));
