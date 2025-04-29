import { getSession } from "@/lib/session";
import { User } from "@/types/user";
import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FilterState {
  kasir: string;
  loket: string;
  golongan: string;
  kecamatan: string;
  kasirName: string;
  loketName: string;
  kecamatanName: string;
  golonganName: string;
  user: User | null;
  setKasir: (kasir: string) => void;
  setLoket: (loket: string) => void;
  setGolongan: (golongan: string) => void;
  setKecamatan: (kecamatan: string) => void;
  setKasirName: (kasir: string) => void;
  setLoketName: (loket: string) => void;
  setGolonganName: (golongan: string) => void;
  setKecamatanName: (kecamatan: string) => void;
  setUser: (user: User | null) => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      kasir: "",
      kasirName: "",
      loket: "",
      loketName: "",
      golongan: "",
      golonganName: "",
      kecamatan: "",
      kecamatanName: "",
      user: null,
      setKasir: (kasir) => set({ kasir }),
      setKasirName: (kasirName) => set({ kasirName }),
      setLoket: (loket) => set({ loket }),
      setLoketName: (loketName) => set({ loketName }),
      setGolongan: (golongan) => set({ golongan }),
      setGolonganName: (golonganName) => set({ golonganName }),
      setKecamatan: (kecamatan) => set({ kecamatan }),
      setKecamatanName: (kecamatanName) => set({ kecamatanName }),
      setUser: (user) => {
        set({
          user,
          kasir: user?.id.toString() || "",
          loket: user?.loketId?.toString() || "",
          kasirName: user?.nama,
          loketName: user?.kodeloket,
        });
      },
    }),
    {
      name: "filter-store",
    }
  )
);

export const useInitFilterStore = () => {
  const setUser = useFilterStore((state) => state.setUser);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      console.log(session);
      if (session?.session) {
        setUser(session.session);
      }
    };

    fetchSession();
  }, [setUser]);
};
