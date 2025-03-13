import { Role } from "@/types/role";
import { create } from "zustand";

type RoleStore = {
  roles: Role[];
  setRoles: (newRoles: Role[]) => void;
};

export const useRoleStore = create<RoleStore>((set) => ({
  roles: [],

  setRoles: (newRoles) => set({ roles: newRoles }),
}));
