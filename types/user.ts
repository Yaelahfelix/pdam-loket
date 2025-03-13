export interface User {
  id: number;
  username: string;
  nama: string;
  jabatan: string;
  kodeloket: string;
  role: string;
  role_id: number;
  is_user_ppob: boolean;
  is_active: boolean;
  is_user_timtagih: boolean;
  loket_array: UserLoket[] | null;
}

export interface UserLoket {
  id: number;
  kodeloket: string;
  loket: string;
}
