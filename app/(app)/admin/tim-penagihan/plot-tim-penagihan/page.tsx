"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import useSWR, { mutate } from "swr";
import {
  addToast,
  Button,
  Card,
  CardBody,
  Divider,
  Skeleton,
  toast,
  useToast,
} from "@heroui/react";
import BreadcrumbsComponent from "./breadcrumbs";
import { DataRayonPetugas, Rayon } from "@/types/plot-tim-tagih";
import TableRayon from "./table-rayon";
import {
  CalendarArrowUp,
  CircleCheckBig,
  CornerDownLeft,
  RefreshCcw,
} from "lucide-react";
import { ComboboxPetugas } from "./petugas-combobox";
import TableRayonPetugas from "./table-rayon-petugas";
import { getSession } from "@/lib/session";
import fetcher from "@/lib/swr/fetcher";

export interface FilterData {
  user: User[];
  loket: Loket[];
}
interface Loket {
  id: number;
  kodeloket: string;
  loket: string;
  aktif: number;
}
interface User {
  id: number;
  nama: string;
}

const UserAkses = () => {
  const [rayon, setRayon] = useState<Rayon[]>([]);
  const [isLoadingRayon, setIsLoadingRayon] = useState(true);
  const [selectedRayon, setSelectedRayon] = useState<string[] | "all" | null>(
    null
  );
  const [petugasId, setPetugasId] = useState<number | null>(null);
  const [isJadwalkanLoading, setIsJadwalkanLoading] = useState(false);

  const {
    data: dataRayonPetugas,
    error: errorRayonPetugas,
    isLoading: isLoadingRayonPetugas,
    mutate: mutateRayonPetugas,
  } = useSWR<{ data: DataRayonPetugas[] }>(
    petugasId ? `/api/tim-penagihan/plot-tim-tagih?id=${petugasId}` : null,
    fetcher
  );

  useEffect(() => {
    fetchRayonData();
  }, []);

  const fetchRayonData = async () => {
    try {
      setIsLoadingRayon(true);
      const res = await fetcher("/api/tim-penagihan/plot-tim-tagih/rayon");
      setRayon(res.data);
    } catch (error) {
      console.error("Error fetching rayon data:", error);
      addToast({
        color: "danger",
        title: "Error",
        description: "Gagal memuat data rayon",
      });
    } finally {
      setIsLoadingRayon(false);
    }
  };

  const handleJadwalkan = async () => {
    if (!petugasId) {
      addToast({
        title: "Error",
        color: "danger",
        description: "Pilih petugas terlebih dahulu",
      });
      return;
    }

    if (!selectedRayon || selectedRayon.length === 0) {
      addToast({
        title: "Error",
        color: "danger",
        description: "Pilih petugas terlebih dahulu",
      });
      return;
    }

    if (!selectedRayon || selectedRayon.length === 0) {
      addToast({
        title: "Error",
        color: "danger",
        description: "Pilih rayon terlebih dahulu",
      });
      return;
    }

    try {
      setIsJadwalkanLoading(true);
      const session = await getSession();

      console.log(selectedRayon);
      const rayonIds =
        selectedRayon === "all"
          ? rayon.map((r) => r.id.toString())
          : selectedRayon;

      console.log(rayonIds);

      await axios.post(
        `/api/tim-penagihan/plot-tim-tagih`,
        {
          petugasId,
          rayonIds: rayonIds.map((id) => Number(id)), // Send array of rayon IDs
        },
        {
          headers: {
            Authorization: `Bearer ${session?.token.value}`,
          },
        }
      );

      await mutateRayonPetugas();

      addToast({
        color: "success",
        title: "Berhasil",
        description: "Berhasil menjadwalkan petugas",
      });
    } catch (error) {
      console.error("Error scheduling petugas:", error);
      addToast({
        color: "danger",
        title: "Error",
        description: "Gagal menjadwalkan petugas",
      });
    } finally {
      setIsJadwalkanLoading(false);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([
      fetchRayonData(),
      petugasId ? mutateRayonPetugas() : Promise.resolve(),
    ]);

    addToast({
      title: "Refresh",
      color: "success",
      description: "Data berhasil diperbarui",
    });
  };

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <BreadcrumbsComponent />
      <h3 className="text-xl font-semibold">Plot Tim Penagihan</h3>
      <Card>
        <CardBody className="flex-row gap-5">
          <div className="w-5/12">
            {isLoadingRayon ? (
              <div className="p-5 border rounded-lg h-[80vh]">
                <Skeleton className="h-full w-full rounded-lg" />
              </div>
            ) : rayon ? (
              <TableRayon
                handler={(id) => {
                  fetcher(
                    "/api/tim-penagihan/plot-tim-tagih/rayon/informasi-plot?id=" +
                      id
                  ).then((res) =>
                    addToast({
                      color: "primary",

                      description:
                        "Sudah diplotkan kepada: " + res.data[0].nama,
                    })
                  );
                  setSelectedRayon(id);
                }}
                selectedRayon={selectedRayon}
                data={rayon}
                // isLoading={isLoadingRayon}
              />
            ) : (
              <div>Tidak ada data</div>
            )}
          </div>
          <div className="w-[100px] bg-background rounded-lg border p-3 flex flex-col justify-center">
            <div className="flex flex-col">
              <Button
                variant="flat"
                className="w-full"
                isIconOnly
                color="primary"
                isLoading={isLoadingRayon || isLoadingRayonPetugas}
                onPress={handleRefresh}
              >
                <RefreshCcw />
              </Button>
              <p className="text-sm text-nowrap text-center text-slate-700 dark:text-slate-300">
                Refresh
              </p>
            </div>
            <Divider className="my-5" />
            <div className="flex flex-col">
              <Button
                variant="flat"
                className="w-full"
                isIconOnly
                color="warning"
                onPress={() => setSelectedRayon(rayon.map((r) => String(r.id)))}
              >
                <CircleCheckBig />
              </Button>
              <p className="text-sm text-nowrap text-center text-slate-700 dark:text-slate-300">
                Contreng
              </p>
            </div>
            <Divider className="my-5" />
            <div className="flex flex-col">
              <Button
                variant="flat"
                className="w-full"
                isIconOnly
                color="danger"
                onPress={() => setSelectedRayon(null)}
              >
                <CornerDownLeft />
              </Button>
              <p className="text-sm text-nowrap text-center text-slate-700 dark:text-slate-300">
                Kosongkan
              </p>
            </div>
            <Divider className="my-5" />
            <div className="flex flex-col">
              <Button
                variant="flat"
                className="w-full"
                isIconOnly
                color="success"
                isLoading={isJadwalkanLoading}
                onPress={handleJadwalkan}
                isDisabled={!petugasId || !selectedRayon}
              >
                <CalendarArrowUp />
              </Button>
              <p className="text-sm text-nowrap text-center text-slate-700 dark:text-slate-300">
                Jadwalkan
              </p>
            </div>
          </div>
          <div className="w-6/12">
            <h1 className="text-lg font-bold text-center">
              Plot Bacameter Rayon
            </h1>
            <Divider className="my-5" />
            <ComboboxPetugas
              handler={(id) => {
                if (id) {
                  setPetugasId(Number(id));
                }
              }}
            />
            <div className="mt-5">
              {isLoadingRayonPetugas ? (
                <div className="p-5 border rounded-lg">
                  <Skeleton className="h-56 w-full rounded-lg" />
                </div>
              ) : errorRayonPetugas ? (
                <div className="p-5 border rounded-lg text-center text-red-500">
                  Error loading data. Please try again.
                </div>
              ) : dataRayonPetugas ? (
                <TableRayonPetugas
                  handler={() => {}}
                  data={dataRayonPetugas.data}
                />
              ) : (
                <div className="p-5 border rounded-lg text-center text-gray-500">
                  Pilih petugas untuk melihat data rayon
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default UserAkses;
