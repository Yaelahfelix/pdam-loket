import { create } from "zustand";

interface FilterState {
  kasir: string;
  loket: string;
  golongan: string;
  kecamatan: string;
  setKasir: (kasir: string) => void;
  setLoket: (loket: string) => void;
  setGolongan: (golongan: string) => void;
  setKecamatan: (kecamatan: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  kasir: "",
  loket: "1",
  golongan: "",
  kecamatan: "",
  setKasir: (kasir) => set({ kasir }),
  setLoket: (loket) => set({ loket }),
  setGolongan: (golongan) => set({ golongan }),
  setKecamatan: (kecamatan) => set({ kecamatan }),
}));
