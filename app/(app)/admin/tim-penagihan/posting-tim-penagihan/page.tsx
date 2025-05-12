"use client";

import { deleteAuthCookie } from "@/actions/auth.action";
import Squares from "@/components/Squares/Squares";
import MonthPicker from "@/components/ui/monthPicker";
import { getSession } from "@/lib/session";
import { deleteSidebar } from "@/lib/sidebar";
import {
  errToast_INTERNALSERVER,
  errToast_UNAUTHORIZED,
} from "@/lib/toast/templatemsg/error";
import { ErrorResponse } from "@/types/axios";
import {
  addToast,
  Alert,
  Button,
  Progress,
  useDisclosure,
} from "@heroui/react";
import axios, { AxiosError } from "axios";
import { format } from "date-fns";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { PostingBatch, PostingBatchBackup } from "./types";
import fetcher from "@/lib/swr/fetcher";
import { formatPeriode } from "@/lib/formatPeriode";

const UserAkses = () => {
  const { resolvedTheme } = useTheme();
  const [date, setDate] = React.useState(new Date());
  const [progress, setProgress] = useState(0);
  const [logPosting, setLogPosting] = useState("");
  const { onOpen, onOpenChange, onClose, isOpen } = useDisclosure();
  const Router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [batchData, setBatchData] = useState<PostingBatch>();
  const [batchNumber, setBatchNumber] = useState(1);
  const [backupId, setBackupId] = useState<number>();
  const [isPendingPosting, setisPendingPosting] = useState(false);

  useEffect(() => {
    fetcher("/api/tim-penagihan/posting-tim-drd/status/check").then((res) => {
      if (res.data) {
        const total = res.data.totalBatches;
        const progressPerBatch = 89 / total;
        setisPendingPosting(true);
        setBackupId(res.data.id);
        setBatchNumber(res.data.batchNumber + 1);
        setBatchData({
          batchSize: res.data.batchSize,
          flagPostUlang: res.data.flagPostUlang,
          selectedPeriod: res.data.selectedPeriod,
          totalBatches: res.data.totalBatches,
          totalPelanggan: res.data.totalPelanggan,
        });
        setProgress(10 + Math.round(res.data.batchNumber * progressPerBatch));
      }
    });
  }, []);

  const handlePosting = async () => {
    try {
      setIsLoading(true);
      setLogPosting("Memulai proses posting...");

      const session = await getSession().catch((err) => {
        setLogPosting(`Error saat mengambil session: ${err.message}`);
        throw err;
      });

      setLogPosting("Mengambil data tagihan...");

      const res = await axios.post(
        "/api/tim-penagihan/posting-tim-drd/init",
        { periode: format(date, "yyyyMM") },
        {
          headers: {
            Authorization: `Bearer ${session?.token.value}`,
          },
        }
      );

      addToast({ color: "success", title: res.data.message });
      setBatchData(res.data.data);
      setProgress(5);
      setLogPosting("Berhasil mengambil data tagihan...");
      handleBackup(res.data.data);
    } catch (err) {
      setIsLoading(false);
      const error = err as AxiosError<ErrorResponse>;

      setLogPosting(
        `Error pada handlePosting: ${error.message || "Unknown error"}`
      );

      if (error.status === 401) {
        setLogPosting(
          "Error 401: Unauthorized access - User tidak terautentikasi"
        );
        try {
          await deleteAuthCookie();
          await deleteSidebar();
          addToast({
            title: "Gagal memperbarui data!",
            ...errToast_UNAUTHORIZED,
          });
          Router.replace("/login");
        } catch (logoutErr) {
          setLogPosting(`Error saat logout: ${logoutErr}`);
        }
        return;
      }

      if (error.response && error.response.data) {
        setLogPosting(`${error.response.data.message}`);
        addToast({
          title: error.response.data.message,
          color: "danger",
        });
      } else {
        setLogPosting(
          `Error server: ${error.message || "Internal Server Error"}`
        );
        addToast({
          title: "Gagal memperbarui data!",
          ...errToast_INTERNALSERVER,
        });
      }
    }
  };

  const handleBackup = async (batchData: PostingBatchBackup) => {
    try {
      setIsLoading(true);
      setLogPosting("Memulai proses backup...");

      const session = await getSession().catch((err) => {
        setLogPosting(
          `Error saat mengambil session untuk backup: ${err.message}`
        );
        throw err;
      });

      if (!batchData) {
        const errorMsg = "Terjadi Kesalahan - ERR_2_BATCH_EMPTY";
        setLogPosting(`Error: ${errorMsg} - Data batch kosong`);
        addToast({
          color: "danger",
          title: errorMsg,
          description:
            "Terjadi kesalahan di server. Jika ini terus terjadi, silahkan hubungi admin!",
        });
        setIsLoading(false);
        return;
      }

      setLogPosting("Membuat backup...");

      const body: PostingBatchBackup = {
        batchNumber: 1,
        batchSize: batchData.batchSize,
        flagPostUlang: batchData.flagPostUlang,
        selectedPeriod: batchData.selectedPeriod,
        status: "INIT",
        totalBatches: batchData.totalBatches,
        totalPelanggan: batchData.totalPelanggan,
      };

      const res = await axios.post(
        "/api/tim-penagihan/posting-tim-drd/backup",
        body,
        {
          headers: {
            Authorization: `Bearer ${session?.token.value}`,
          },
        }
      );

      addToast({ color: "success", title: res.data.message });
      setBackupId(res.data.backupID);
      setProgress(10);
      setLogPosting("Berhasil membuat backup...");

      setLogPosting(
        `Besar Batch : ${batchData.batchSize} dengan total batch ${batchData.totalBatches}, memulai posting dalam 5 detik`
      );

      setTimeout(() => {
        setLogPosting("Memulai posting...");
        handleProcessBatch(batchData, res.data.backupID);
      }, 5000);
    } catch (err) {
      setIsLoading(false);
      const error = err as AxiosError<ErrorResponse>;

      setLogPosting(
        `Error pada handleBackup: ${error.message || "Unknown error"}`
      );

      if (error.status === 401) {
        setLogPosting(
          "Error 401: Unauthorized access pada proses backup - User tidak terautentikasi"
        );
        try {
          await deleteAuthCookie();
          await deleteSidebar();
          addToast({
            title: "Gagal memperbarui data!",
            ...errToast_UNAUTHORIZED,
          });
          Router.replace("/login");
        } catch (logoutErr) {
          setLogPosting(`Error saat logout dari backup: ${logoutErr}`);
        }
        return;
      }

      if (error.response && error.response.data) {
        setLogPosting(`Error response backup: ${error.response.data.message}`);
        addToast({
          title: error.response.data.message,
          color: "danger",
        });
      } else {
        setLogPosting(
          `Error server pada backup: ${
            error.message || "Internal Server Error"
          }`
        );
        addToast({
          title: "Gagal memperbarui data!",
          ...errToast_INTERNALSERVER,
        });
      }
    }
  };

  const handleProcessBatch = async (
    batchData: PostingBatchBackup,
    backupId: number
  ) => {
    try {
      setIsLoading(true);
      setLogPosting("Memulai proses batch...");

      if (!batchData || !backupId) {
        const errorMsg = "Terjadi Kesalahan - ERR_3_BATCH_OR_ID_EMPTY";
        setLogPosting(`Error: ${errorMsg} - Data batch atau ID backup kosong`);
        addToast({
          color: "danger",
          title: errorMsg,
          description:
            "Terjadi kesalahan di server. Jika ini terus terjadi, silahkan hubungi admin!",
        });
        setIsLoading(false);
        return;
      }

      const total = batchData.totalBatches;
      const progressPerBatch = 89 / total;

      const session = await getSession().catch((err) => {
        setLogPosting(
          `Error saat mengambil session untuk proses batch: ${err.message}`
        );
        throw err;
      });

      setLogPosting(`Memproses total ${batchData.totalBatches} batch...`);

      if (batchData.totalBatches !== batchData.batchNumber) {
        for (
          let i = batchData.batchNumber || 1;
          i <= batchData.totalBatches;
          i++
        ) {
          try {
            setLogPosting(`Memproses batch ${i}/${batchData.totalBatches}...`);

            const res = await axios.post(
              "/api/tim-penagihan/posting-tim-drd/process",
              {
                periode: batchData.selectedPeriod,
                batchNumber: i,
                backupId,
                batchSize: batchData.batchSize,
              },
              {
                headers: {
                  Authorization: `Bearer ${session?.token.value}`,
                },
              }
            );

            if (res.status === 200) {
              setBatchNumber(i);
              setProgress(10 + Math.round(i * progressPerBatch));
              setLogPosting(
                `Batch ${i}/${batchData.totalBatches} berhasil diproses`
              );
              console.log(res.data);
            }
          } catch (batchErr) {
            const error = batchErr as AxiosError<ErrorResponse>;

            if (error.status === 401) {
              await deleteAuthCookie();
              await deleteSidebar();
              addToast({
                title: "Gagal memproses batch!",
                ...errToast_UNAUTHORIZED,
              });
              Router.replace("/login");
              return;
            }

            if (error.response && error.response.data) {
              addToast({
                title: `Gagal memproses batch ${i}: ${error.response.data.message}`,
                color: "danger",
              });
            } else {
              addToast({
                title: `Gagal memproses batch ${i}!`,
                ...errToast_INTERNALSERVER,
              });
            }
            setLogPosting(
              `Proses posting dihentikan pada batch ${i} karena terjadi error`
            );
            setIsLoading(false);
            return;
          }
        }
      }

      await fetcher("/api/tim-penagihan/posting-tim-drd/finish?id=" + backupId);
      setIsLoading(false);
      setLogPosting(`Berhasil memosting semua batch`);
      setProgress(0);
      setisPendingPosting(false);
      addToast({
        color: "success",
        title: "Berhasil memosting semua pelanggan!",
      });
    } catch (err) {
      setIsLoading(false);
      const error = err as AxiosError<ErrorResponse>;

      setLogPosting(
        `Error umum pada handleProcessBatch: ${
          error.message || "Unknown error"
        }`
      );

      if (error.status === 401) {
        setLogPosting(
          "Error 401: Unauthorized access pada proses batch - User tidak terautentikasi"
        );
        try {
          await deleteAuthCookie();
          await deleteSidebar();
          addToast({
            title: "Gagal memproses batch!",
            ...errToast_UNAUTHORIZED,
          });
          Router.replace("/login");
        } catch (logoutErr) {
          setLogPosting(`Error saat logout dari proses batch: ${logoutErr}`);
        }
        return;
      }

      if (error.response && error.response.data) {
        setLogPosting(
          `Error response proses batch: ${error.response.data.message}`
        );
        addToast({
          title: error.response.data.message,
          color: "danger",
        });
      } else {
        setLogPosting(
          `Error server pada proses batch: ${
            error.message || "Internal Server Error"
          }`
        );
        addToast({
          title: "Gagal memproses batch!",
          ...errToast_INTERNALSERVER,
        });
      }
    }
  };

  return (
    <div className="h-[95vh] w-full flex justify-center items-center relative overflow-hidden">
      <Squares
        speed={0.5}
        squareSize={40}
        direction="diagonal"
        borderColor={resolvedTheme === "dark" ? "#414241" : "#EBEAEA"}
        hoverFillColor={resolvedTheme === "dark" ? "#595959" : "#B1B0B0"}
        gradientVal={resolvedTheme === "dark" ? "#060606" : "#fff"}
      />
      <div className="w-8/12 bg-gray-100  rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 dark:bg-gray-700 dark:bg-opacity-20 border border-gray-300 dark:border-gray-900 text-center p-5 absolute">
        <Alert
          color="danger"
          title="PERHATIAN!"
          description="Jangan beralih ke halaman lain dan dilarang keras menutup Tab atau browser saat melakukan posting. Dan pastikan tidak ada kendala pada jaringan!"
          className="mb-4"
        />

        <div className="flex gap-5">
          <div className="w-6/12 text-left">
            <p className="mb-5">Note</p>
            <ul className="ml-5 list-disc gap-3 flex flex-col">
              <li>Posting Tim Tagih hanya bisa 1x dalam satu periode</li>
              <li>
                Posting ulang bisa dilakukan jika Tgl Hari ini masih dalam
                periode yang sama dengan periode posting
              </li>
              <li>
                Posting Tim Tagih harus dilakukan setelah selesai melakukan{" "}
                <b>Posting Pelanggan</b> dalam satu periode
              </li>
              <li>
                Pastikan Plot Rute Tim Tagih dan Hak Akses Lembar User sudah di
                setting dengan baik
              </li>
            </ul>
          </div>
          <div className="w-6/12 flex justify-between flex-col">
            <div>
              <h3 className="font-bold text-center mb-5">
                Posting Tim Penagihan
              </h3>
              <MonthPicker
                className="w-full"
                currentMonth={date}
                isDisabled={isLoading || isPendingPosting}
                onMonthChange={(val) => {
                  setDate(val);
                }}
              />
            </div>
            <div className="flex flex-col gap-5">
              {isPendingPosting && (
                <Alert
                  color="warning"
                  description={`Posting periode ${formatPeriode(
                    batchData!.selectedPeriod
                  )} belum selesai. Lanjutkan posting yang tertunda untuk memulai posting baru!`}
                />
              )}
              <div>
                <Progress
                  aria-label="Progress..."
                  isDisabled={!isLoading}
                  className="w-full"
                  color="success"
                  showValueLabel={true}
                  label="Progres Posting"
                  size="sm"
                  value={progress}
                />
                {logPosting && (
                  <p className="text-xs opacity-70 mt-3">{logPosting}</p>
                )}
              </div>
              <Button
                className="w-full"
                color="warning"
                isLoading={isLoading}
                onPress={() =>
                  isPendingPosting
                    ? handleProcessBatch(
                        {
                          batchNumber,
                          batchSize: batchData!.batchSize,
                          flagPostUlang: batchData!.flagPostUlang,
                          selectedPeriod: batchData!.selectedPeriod,
                          status: "RUNNING",
                          totalBatches: batchData!.totalBatches,
                          totalPelanggan: batchData!.totalPelanggan,
                        },
                        backupId!
                      )
                    : handlePosting()
                }
              >
                {isPendingPosting
                  ? "Lanjutkan posting..."
                  : "Posting pelanggan"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAkses;
