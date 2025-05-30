"use client";

import { createAuthCookie } from "@/actions/auth.action";
import { LoginSchema } from "@/helpers/schemas";
import { LoginFormType } from "@/helpers/types";
import { setSession } from "@/lib/session";
import { errToast_INTERNALSERVER } from "@/lib/toast/templatemsg/error";
import { ErrorResponse } from "@/types/axios";
import { User, UserLoket } from "@/types/user";
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import axios, { AxiosError } from "axios";
import { Formik, FormikHelpers } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<User>();
  const [loket, setLoket] = useState<UserLoket[]>();
  const [selectedLoket, setSelectedLoket] = useState<UserLoket>();
  const [error, setError] = useState("");

  const initialValues: LoginFormType = {
    username: "",
    password: "",
  };

  const handleLogin = useCallback(
    async (
      values: LoginFormType,
      { setFieldError }: FormikHelpers<LoginFormType>
    ) => {
      setIsLoading(true);
      axios
        .post("/api/auth/login", values)
        .then((res) => {
          const { user, loket }: { user: User; loket: UserLoket[] } = res.data;
          setUser(user);
          setLoket(loket);
        })
        .catch((err: AxiosError<ErrorResponse>) => {
          setFieldError("password", err.response?.data.message);
          return addToast({
            title: "Gagal login!",
            ...errToast_INTERNALSERVER,
          });
        })
        .finally(() => setIsLoading(false));
    },
    []
  );

  const handleLoket = async () => {
    setError("");
    setIsLoading(true);
    if (!user || !selectedLoket) {
      return addToast(errToast_INTERNALSERVER);
    }
    if (!selectedLoket.aktif) {
      setError("Loket kamu tidak aktif, coba loket lain!");
      return setIsLoading(false);
    }
    if (!selectedLoket.is_loket_aktif) {
      setError(
        "Loket yang kamu pilih sedang tidak aktif, silahkan hubungi admin"
      );
      return setIsLoading(false);
    }
    setSession(
      user.id,
      user.username,
      user.nama,
      user.jabatan,
      user.role,
      selectedLoket?.id,
      selectedLoket?.kodeloket,
      user.is_user_ppob,
      user.is_active,
      user.is_user_timtagih,
      user.role_id
    )
      .then(() => router.push("/admin"))
      .catch((err) => {
        setIsLoading(false);
        return addToast(errToast_INTERNALSERVER);
      });
  };
  return (
    <>
      <div className="text-center text-[25px] font-bold mb-6">Login</div>

      {/* //? Kondisi pemilihan loket, jika user berhasil login, maka akan di tampilkan ui pilih loket */}
      {!loket ? (
        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ values, errors, touched, handleChange, handleSubmit }) => (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-1/2 gap-4 mb-4"
            >
              <Input
                variant="bordered"
                label="Username"
                type="text"
                value={values.username}
                isInvalid={!!errors.username && !!touched.username}
                errorMessage={errors.username}
                onChange={handleChange("username")}
              />
              <Input
                variant="bordered"
                label="Password"
                type="password"
                value={values.password}
                isInvalid={!!errors.password && !!touched.password}
                errorMessage={errors.password}
                onChange={handleChange("password")}
              />

              <Button
                variant="flat"
                color="primary"
                isLoading={isLoading}
                type="submit"
              >
                Login
              </Button>
            </form>
          )}
        </Formik>
      ) : (
        <Card className="w-6/12">
          <CardHeader className="flex justify-center">
            <h3 className="text-center font-light">Pilih Loket</h3>
          </CardHeader>
          <CardBody>
            <Select
              className="w-full"
              placeholder="Pilih loket"
              isInvalid={error ? true : false}
              errorMessage={error}
              value={selectedLoket?.loket}
              onChange={(val) => {
                const newSelectLoket = loket.find(
                  (item) => item.kodeloket === val.target.value
                );
                setSelectedLoket(newSelectLoket);
              }}
            >
              {loket.map((loket) => (
                <SelectItem key={loket.kodeloket}>{loket.loket}</SelectItem>
              ))}
            </Select>
          </CardBody>
          <CardFooter>
            <Button
              className="w-full"
              variant="shadow"
              color="secondary"
              isDisabled={!selectedLoket}
              onPress={handleLoket}
              isLoading={isLoading}
            >
              Masuk
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
};
