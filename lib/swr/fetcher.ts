import { ErrorResponse } from "@/types/axios";
import axios, { AxiosError } from "axios";

const fetcher = async (url: string) => {
  const session = await (await import("@/lib/session")).getSession();
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
        window.location.href = "/error";
      }
      throw error;
    });
};

export default fetcher;
