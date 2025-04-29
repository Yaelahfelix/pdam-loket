export interface Role {
  id: number;
  role: string;
}

export interface RoleAkses {
  id: number;
  role: string;
  menuutamamenuutama: string;
}

export interface RoleDetailResponse {
  role_id: number;
  role_name: string;
  menus: MenuRole[];
}
interface MenuRole {
  id: number | null;
  group_name: string;
  menu_utama_id: number;
  menu_id: number;
  menu_name: string;
  group_url: string;
  menu_url: string;
  aktif: boolean;
}
