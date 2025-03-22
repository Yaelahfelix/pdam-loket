import * as yup from "yup";

export const LoginSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export const UserSchema = yup.object().shape({
  username: yup.string().max(50).required("Username is required"),
  password: yup.string().max(100).required("Password is required"),
  nama: yup.string().max(50).required("Nama is required"),
  jabatan: yup.string().max(50).required("Jabatan is required"),
  role_id: yup.number().integer().required("Role is required"),
  is_user_ppob: yup.boolean().required("PPOB status is required"),
  is_active: yup.boolean().required("Active status is required"),
  is_user_timtagih: yup.boolean().required("Tim Tagih status is required"),
});

export const UserLoketSchema = yup.object().shape({
  user_id: yup.number().required("User ID is required"),
  loket_id: yup.number().required("Loket ID is required"),
  aktif: yup.boolean().required("Status is required"),
});

export const MasterLoketSchema = yup.object().shape({
  kodeloket: yup.string().max(50).required("Kode Loket is required"),
  loket: yup.string().max(50).required("Nama Loket is required"),
  aktif: yup.boolean().required("Aktif status is required"),
});

export const MasterKolektifSchema = yup.object().shape({
  no_kolektif: yup.string().max(50).required("Nomor kolektif is required"),
  nama: yup.string().max(50).required("Nama kolektif is required"),
  telp: yup.string().max(50).optional(),
});

export const DendaSchema = yup.object().shape({
  idx: yup.number().required("Idx is required"),
  tgl1: yup.number().required("Tanggal 1 is required"),
  tgl2: yup.number().required("Tanggal 2 is required"),
  flagpersen: yup.number().required("Flag Persen is required"),
  denda1: yup
    .number()
    .required("Denda 1 is required")
    .typeError("Denda 1 must be a number")
    .min(0, "Denda 1 cannot be negative"),
  denda2: yup
    .number()
    .required("Denda 2 is required")
    .typeError("Denda 2 must be a number")
    .min(0, "Denda 2 cannot be negative"),
});

export const DesktopSettingsSchema = yup.object().shape({
  idx: yup.number().required("Index wajib diisi"),
  mundurtglbyr: yup.number().required("Mundur tanggal bayar wajib diisi"),
  headerlap1: yup.string().required("Header Laporan 1 wajib diisi"),
  headerlap2: yup.string().required("Header Laporan 2 wajib diisi"),
  alamat1: yup.string().required("Alamat 1 wajib diisi"),
  alamat2: yup.string().required("Alamat 2 wajib diisi"),
  footerkota: yup.string().required("Footer Kota wajib diisi"),
  stricpayment: yup.boolean().required("Strict Payment wajib diisi"),
  information: yup.string().required("Informasi wajib diisi"),
});
