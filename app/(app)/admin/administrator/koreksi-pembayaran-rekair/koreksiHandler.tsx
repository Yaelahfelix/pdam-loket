import {
  addToast,
  Button,
  CalendarDate,
  DatePicker,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { FilterData } from "./page";
import { getLocalTimeZone, today } from "@internationalized/date";
import { KoreksiPembayaran } from "@/types/koreksi-pembayaran";
import { getSession } from "@/lib/session";
import axios, { AxiosError } from "axios";
import { format } from "date-fns";
import { ErrorResponse } from "@/types/axios";
import { deleteAuthCookie } from "@/actions/auth.action";
import { deleteSidebar } from "@/lib/sidebar";
import {
  errToast_INTERNALSERVER,
  errToast_UNAUTHORIZED,
} from "@/lib/toast/templatemsg/error";
import { useRouter } from "next/navigation";

type Props = {
  filter: FilterData;
  tipeFilter: string;
  defaultKasir: string;
  defaultLoket: string;
  data: KoreksiPembayaran[];
};

const KoreksiHandler = ({
  filter,
  defaultKasir,
  defaultLoket,
  data,
  tipeFilter,
}: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedKasir, setSelectedKasir] = useState("");
  const [selectedLoket, setSelectedLoket] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const todayDate = today(getLocalTimeZone());
  const minDate = todayDate.subtract({ days: 7 });

  const Router = useRouter();
  const maxDate = todayDate.add({ days: 7 });
  const kasirId = Array.from(selectedKasir)[0];
  const loketId = Array.from(selectedLoket)[0];
  const kasir = filter.user.find((data) => data.id === Number(kasirId));
  const loket = filter.loket.find((data) => data.id === Number(loketId));
  const [tgl, setTgl] = useState<CalendarDate>(todayDate);
  const formattedDate = format(tgl?.toDate("Asia/Jakarta"), "yyyy-MM-dd");

  useEffect(() => {
    setSelectedKasir(defaultKasir);
    setSelectedLoket(defaultLoket);
  }, [data]);

  const submitHandler = async (onClose: () => void) => {
    setIsLoading(true);
    const session = await getSession();

    axios["post"](
      "/api/koreksi-pembayaran",
      {
        data,
        filter: tipeFilter,
        loket_id: loket?.id,
        nama_loket: loket?.loket,
        user_id: kasir?.id,
        nama_user: kasir?.nama,
        userkor: session?.session.username,
        tglbayar: formattedDate,
      },
      {
        headers: {
          Authorization: `Bearer ${session?.token.value}`,
        },
      }
    )
      .then((res) => {
        addToast({ color: "success", title: res.data.message });
        onClose();
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
    <>
      <Button onPress={onOpen} isDisabled={data.length === 0}>
        Koreksi Rekening
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Konfirmasi Koreksi {data.length} Rekening
              </ModalHeader>
              <ModalBody>
                <div className="flex gap-5">
                  <DatePicker
                    className="w-full max-w-xs"
                    variant="bordered"
                    label="Tanggal"
                    minValue={minDate}
                    maxValue={maxDate}
                    value={tgl}
                    onChange={(tgl) => {
                      if (!tgl) return;
                      setTgl(tgl);
                    }}
                  />
                  <Select
                    className="max-w-xs"
                    label="Pilih kasir"
                    isDisabled={
                      tipeFilter !== "kasir" && tipeFilter !== "nopel"
                    }
                    selectedKeys={selectedKasir}
                    onSelectionChange={(val) => {
                      setSelectedKasir(val as any);
                    }}
                  >
                    {filter.user.map((data) => (
                      <SelectItem key={data.id}>{data.nama}</SelectItem>
                    ))}
                  </Select>
                  <Select
                    className="max-w-xs"
                    label="Pilih loket"
                    isDisabled={
                      tipeFilter !== "loket" && tipeFilter !== "nopel"
                    }
                    selectedKeys={selectedLoket}
                    onSelectionChange={(val) => {
                      setSelectedLoket(val as any);
                    }}
                  >
                    {filter.loket.map((data) => (
                      <SelectItem key={data.id}>{data.loket}</SelectItem>
                    ))}
                  </Select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Tutup
                </Button>
                <Button
                  color="primary"
                  isLoading={isLoading}
                  onPress={() => {
                    submitHandler(onClose);
                  }}
                >
                  Koreksi
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default KoreksiHandler;
