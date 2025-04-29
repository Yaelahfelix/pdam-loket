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

export interface TTDFormType {
  header1: string;
  header2: string;
  header3: string;
  header4: string;
  id1: number;
  id2: number;
  id3: number;
  id4: number;
  is_id_1: boolean;
  is_id_2: boolean;
  is_id_3: boolean;
  is_id_4: boolean;
  nama1: string;
  nama2: string;
  nama3: string;
  nama4: string;
}
