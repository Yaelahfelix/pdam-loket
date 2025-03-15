import { ToastProps } from "@heroui/react";

export const errToast_INTERNALSERVER: Partial<ToastProps> = {
  description:
    "Terjadi kesalahan, silahkan coba lagi. Jika ini terus terjadi silahkan hubungi admin",
  color: "danger",
};

export const errToast_UNAUTHORIZED: Partial<ToastProps> = {
  description: "Sesi kamu sudah habi. Silahkan login kembali!",
  color: "danger",
};
