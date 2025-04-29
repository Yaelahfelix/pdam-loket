"use client";

import { deleteAuthCookie } from "@/actions/auth.action";
import LocationInputForm, { LocationData } from "@/components/form/Location";
import {
  DendaSchema,
  DesktopSettingsSchema,
  UserSchema,
} from "@/helpers/schemas";
import { UserFormType } from "@/helpers/types";
import { defaultErrorHandler } from "@/lib/dbQuery/defaultErrorHandler";
import { getSession } from "@/lib/session";
import { deleteSidebar } from "@/lib/sidebar";
import fetcher from "@/lib/swr/fetcher";
import {
  errToast_INTERNALSERVER,
  errToast_UNAUTHORIZED,
} from "@/lib/toast/templatemsg/error";
import { ErrorResponse } from "@/types/axios";
import { Role } from "@/types/role";
import { DekstopSettings, Denda } from "@/types/settings";
import { User } from "@/types/user";
import {
  addToast,
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import axios, { AxiosError } from "axios";
import { ErrorMessage, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { ReactNode, useCallback, useEffect, useState } from "react";

export const FormMaps = ({}: {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const Router = useRouter();
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  useEffect(() => {
    fetcher("/api/settings/location").then((res) => {
      setLocationData({
        latitude: Number(res.data.latitude),
        longitude: Number(res.data.longitude),
      });
    });
  }, []);
  const handleSubmit = async () => {
    setIsLoading(true);
    const session = await getSession();
    axios["put"]("/api/settings/location", locationData, {
      headers: {
        Authorization: `Bearer ${session?.token.value}`,
      },
    })
      .then((res) => {
        addToast({ color: "success", title: res.data.message });
        Router.refresh();
      })
      .catch(async (err: AxiosError<ErrorResponse>) => {
        if (err.status === 401) {
          await deleteAuthCookie();
          await deleteSidebar();
          addToast({
            title: "Gagal memperbarui data!",
            ...errToast_UNAUTHORIZED,
          });
          return Router.replace("/login");
        }
        if (err.status !== 500) {
          return addToast({
            title: "Gagal memperbarui data!",
            description: err.response?.data.message,
            color: "danger",
          });
        }
        addToast({
          title: "Gagal memperbarui data!",
          ...errToast_INTERNALSERVER,
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="flex justify-center">
      {locationData && (
        <div className="w-6/12">
          <LocationInputForm
            locationData={locationData}
            className="h-[400px] w-full"
            setLocationData={setLocationData as any}
          />
          <Button
            color="primary"
            className="w-full mt-5"
            onPress={handleSubmit}
          >
            Simpan
          </Button>
        </div>
      )}
    </div>
  );
};
