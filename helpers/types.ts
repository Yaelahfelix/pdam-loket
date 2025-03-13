// FORMS

export type LoginFormType = {
  username: string;
  password: string;
};

export interface UserFormType {
  username: string;
  password: string;
  nama: string;
  jabatan: string;
  role_id?: number;
  is_user_ppob: boolean;
  is_active: boolean;
  is_user_timtagih: boolean;
}
