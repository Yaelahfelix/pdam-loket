import { ErrorResponse } from "@/types/axios";
import axios, { AxiosError } from "axios";
import { getSession } from "../session";
import { addToast } from "@heroui/react";

const fetcher = async (url: string) => {
  const session = await getSession();
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${session?.token.value}`,
      },
    })
    .then((response) => response.data)
    .catch(async (error: AxiosError<ErrorResponse>) => {
      if (error.response?.status === 401) {
        const { deleteSidebar } = await import("@/lib/sidebar");
        const { deleteAuthCookie } = await import("@/actions/auth.action");
        await deleteSidebar();
        await deleteAuthCookie();
        window.location.href = "/login";
      } else {
        addToast({
          title: "Terjadi kesalahan!",
          description: error.response?.data.message,
          color: "danger",
        });
      }

      throw error;
    });
};

export default fetcher;
