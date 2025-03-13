import axios, { AxiosError } from "axios";
import { getSession } from "../session";
import { BASEURL } from "@/constant";
import { redirect } from "next/navigation";
import { defaultErrorHandler } from "./defaultErrorHandler";

export const GET_ALL_ROLE = `SELECT id,role FROM role;`;

export const getAllRole = async () => {
  const session = await getSession();
  return axios
    .get(BASEURL + `/api/administrator/role`, {
      headers: {
        Authorization: `Bearer ${session?.token.value}`,
      },
    })
    .then((res) => {
      return res.data.roles;
    })
    .catch((err) => {
      defaultErrorHandler(err, true);
    });
};
