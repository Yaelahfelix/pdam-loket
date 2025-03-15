"use client";

import { errToast_INTERNALSERVER } from "../toast/templatemsg/error";
import { addToast } from "@heroui/react";

export const errorToast = () => {
  return addToast({ title: "Terjadi kesalahan", ...errToast_INTERNALSERVER });
};
