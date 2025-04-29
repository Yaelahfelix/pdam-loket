import { TotalDRD } from "@/types/drd";
import { DRDNonAir, TotalDRNonAir } from "@/types/lpp-nonair";
import { create } from "zustand";

interface LPPNorAir {
  data: DRDNonAir[];
  total: TotalDRNonAir;
}
type Store = {
  drd?: LPPNorAir;
  setDrd: (newDrd?: LPPNorAir) => void;
};

export const useLPPNonAirStore = create<Store>((set) => ({
  drd: undefined,

  setDrd: (newDrd) => set({ drd: newDrd }),
}));
