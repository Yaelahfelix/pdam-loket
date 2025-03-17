// FORMS

export type LoginFormType = {
  username: string;
  password: string;
};

export interface UserFormType {
  id?: number;
  username: string;
  password: string;
  nama: string;
  jabatan: string;
  role_id?: number;
  is_user_ppob: boolean;
  is_active: boolean;
  is_user_timtagih: boolean;
}

export interface UserLoketFormType {
  id?: number;
  user_id: number;
  loket_id: number;
  aktif: boolean;
}
export interface LoketFormType {
  id?: number;
  kodeloket: string;
  loket: string;
  aktif: boolean;
}

export interface KolektifFormType {
  id?: number;
  no_kolektif: string;
  nama: string;
  telp: string;
}

export interface KolektifPelangganFormType {
  kolektif_id: number;
  no_pelanggan: string;
}
