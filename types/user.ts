export interface User {
  id: number;
  username: string;
  nama: string;
  jabatan: string;
  kodeloket: string;
  role: string;
  is_user_ppob: boolean;
  is_active: boolean;
  is_user_timtagih: boolean;
}

export interface UserLoket {
  kodeloket: string;
  loket: string;
}
