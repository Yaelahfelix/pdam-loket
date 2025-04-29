import { getSession } from "@/lib/session";
import { User } from "@/types/user";
import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FilterState {
  kasir: string;
  loket: string;
  jenis: string;
  kasirName: string;
  loketName: string;
  jenisName: string;

  user: User | null;
  setKasir: (kasir: string) => void;
  setLoket: (loket: string) => void;
  setJenis: (jenis: string) => void;
  setKasirName: (kasir: string) => void;
  setLoketName: (loket: string) => void;
  setJenisName: (jenis: string) => void;
  setUser: (user: User | null) => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      kasir: "",
      kasirName: "",
      loket: "",
      loketName: "",
      jenis: "",
      jenisName: "",
      user: null,
      setKasir: (kasir) => set({ kasir }),
      setKasirName: (kasirName) => set({ kasirName }),
      setLoket: (loket) => set({ loket }),
      setLoketName: (loketName) => set({ loketName }),
      setJenis: (jenis) => set({ jenis }),
      setJenisName: (jenisName) => set({ jenisName }),
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
