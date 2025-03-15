import { Loket } from "@/types/loket";
import { create } from "zustand";

type UserLoket = {
  loket: Loket[];
  setLoket: (newLoket: Loket[]) => void;
};

export const useLoketStore = create<UserLoket>((set) => ({
  loket: [],

  setLoket: (newLoket) => set({ loket: newLoket }),
}));
