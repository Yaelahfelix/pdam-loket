"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Input, Alert } from "@heroui/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { da } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";

export default function ResetPasswordPage() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const Router = useRouter();

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Old password is required"),
    newPassword: Yup.string()
      .notOneOf(
        [Yup.ref("oldPassword")],
        "New password cannot be the same as old password"
      )
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Please confirm your password"),
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const session = await getSession();
        setErrorMsg("");
        const response = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: session?.session.username,
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
          }),
        });
        const data = await response.json();
        console.log("Response from password reset:", data);
        if (response.status !== 200) {
          return setErrorMsg(data.message || "Failed to update password");
        }

        setIsSuccess(true);
        formik.resetForm();
        Router.push("/admin");
      } catch (error: any) {
        console.error("Error resetting password:", error);
        setErrorMsg(error?.message || "Failed to update password");
        setIsSuccess(false);
      }
    },
  });

  const togglePasswordVisibility = (field: any) => {
    switch (field) {
      case "oldPassword":
        setShowOldPassword(!showOldPassword);
        break;
      case "newPassword":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirmPassword":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen  p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your old password and create a new secure password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {isSuccess && (
              <Alert color="success">
                Password has been successfully updated.
              </Alert>
            )}

            {errorMsg && <Alert color="danger">{errorMsg}</Alert>}

            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="oldPassword"
                  name="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  label="Password Lama"
                  className="pr-10"
                  placeholder="Masukkan password kamu sekarang"
                  value={formik.values.oldPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => togglePasswordVisibility("oldPassword")}
                >
                  {showOldPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formik.touched.oldPassword && formik.errors.oldPassword ? (
                <p className="text-sm text-red-600">
                  {formik.errors.oldPassword}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  label="Password Baru"
                  type={showNewPassword ? "text" : "password"}
                  className="pr-10"
                  placeholder="Masukkan Password Baru"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => togglePasswordVisibility("newPassword")}
                >
                  {showNewPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formik.touched.newPassword && formik.errors.newPassword ? (
                <p className="text-sm text-red-600">
                  {formik.errors.newPassword}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Konfirmasi Password Baru"
                  type={showConfirmPassword ? "text" : "password"}
                  className="pr-10"
                  placeholder="Masukkan ulang password barunya"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <p className="text-sm text-red-600">
                  {formik.errors.confirmPassword}
                </p>
              ) : null}
            </div>

            <CardFooter className="px-0 pt-2 pb-0">
              <Button
                type="submit"
                color="primary"
                className="w-full"
                isLoading={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Memperbarui..." : "Perbarui Password"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
