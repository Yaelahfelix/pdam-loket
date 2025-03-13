import { AxiosError } from "axios";
import { redirect } from "next/navigation";
import { errorToast } from "./errorToast";

export const defaultErrorHandler = (err: any, is500redirect: boolean) => {
  console.log(err);
  if (err instanceof AxiosError) {
    if (err.status === 401) {
      return redirect("/login");
    }
  }
  {
    is500redirect ? redirect("/error") : errorToast();
  }
};
