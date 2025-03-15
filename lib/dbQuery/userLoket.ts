import axios, { AxiosError } from "axios";
import { getSession } from "../session";
import { BASEURL } from "@/constant";
import { defaultErrorHandler } from "./defaultErrorHandler";

export const getAllUserLoket = async () => {
  const session = await getSession();
  return axios
    .get(BASEURL + `/api/administrator/user-akses/loket`, {
      headers: {
        Authorization: `Bearer ${session?.token.value}`,
      },
    })
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      defaultErrorHandler(err, true);
    });
};
