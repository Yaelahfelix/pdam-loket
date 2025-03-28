import { DRD, TotalDRD } from "@/types/drd";
import {
  TagihanBlmLunasInfoPel,
  TagihanSdhLunasInfoPel,
  TotalTagihan,
} from "@/types/info-pelanggan";
import { create } from "zustand";

interface InfoPel {
  tagihanBlmLunas: TagihanBlmLunasInfoPel[];
  tagihanSdhLunas: TagihanSdhLunasInfoPel[];
  total: TotalTagihan;
}
type Store = {
  data?: InfoPel;
  setData: (newData?: InfoPel) => void;
};

export const useInfoPelStore = create<Store>((set) => ({
  data: undefined,

  setData: (newData) => set({ data: newData }),
}));
