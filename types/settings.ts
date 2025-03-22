interface MenuDetail {
  menu_id: number;
  menu_name: string;
  link: string;
}

export interface MenuGroup {
  group_name: string;
  menus: MenuDetail[];
}

export interface Denda {
  idx: number;
  tgl1: number;
  tgl2: number;
  flagpersen: number;
  denda1: number;
  denda2: number;
}

export interface DekstopSettings {
  idx: number;
  mundurtglbyr: number;
  headerlap1: string;
  headerlap2: string;
  alamat1: string;
  alamat2: string;
  footerkota: string;
  stricpayment: boolean;
  information: string;
}

export interface PPNSettings {
  id: number;
  jml: number;
  mulaitgl: string;
}

export interface PelCoklitSettings {
  id: number;
  no_pelanggan: string;
}
