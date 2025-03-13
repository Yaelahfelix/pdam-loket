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
  role_id: yup.number().integer().required("Role ID is required"),
  is_user_ppob: yup.boolean().required("PPOB status is required"),
  is_active: yup.boolean().required("Active status is required"),
  is_user_timtagih: yup.boolean().required("Tim Tagih status is required"),
});
