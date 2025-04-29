"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

import BreadcrumbsComponent from "./breadcrumbs";
import {
  addToast,
  Alert,
  Button,
  CalendarDate,
  Card,
  CardBody,
  CardHeader,
  DatePicker,
  DateRangePicker,
  Input,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import {
  CUDataPembayaranRekAir,
  DataPembayaranRekAir,
  PelangganPembayaranRekAir,
} from "@/types/pembayran-rekair";
import { getLocalTimeZone, today } from "@internationalized/date";
import useSWR from "swr";
import { format } from "date-fns";
import fetcher from "@/lib/swr/fetcher";
import { ComboboxKolektif } from "@/components/combobox/kolektif";
import AlertModal from "./alertModal";
import TglModal from "./tglModal";
import DataTableKolektif from "./data-table-kolektif";
import { formatRupiah } from "@/lib/utils";
import { ComboboxPelanggan } from "@/components/combobox/pelanggan";
import DataTableTunggal from "./data-table-tunggal";
import BayarHandler from "./pdfPage";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";
import MonthPicker from "@/components/ui/monthPicker";

export interface Kolektif {
  id: number;
  nama: string;
  no_kolektif: string;
}
export interface DataKolektif {
  data: {
    data: CUDataPembayaranRekAir[];
    color: string;
  }[];
  kolektif: Kolektif;
}
const PembayaranRekAir = () => {
  const [date, setDate] = React.useState({
    start: new Date(),
    end: new Date(),
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [nopel, setNopel] = useState("");
  const [tgl, setTgl] = useState<CalendarDate>(today(getLocalTimeZone()));
  const [strictPayment, setStrictPayment] = useState<boolean>(true);
  const isPrinting = useRef(false);
  const [selectedTunggal, setSelectedTunggal] = useState<
    CUDataPembayaranRekAir[]
  >([]);

  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const [tunggal, setTunggal] = useState<{
    data: CUDataPembayaranRekAir[];
    pelanggan: PelangganPembayaranRekAir;
  } | null>(null);
  const [errorTunggal, setErrorTunggal] = useState<any>(null);
  const [isLoadingTunggal, setIsLoadingTunggal] = useState(false);
  useEffect(() => {
    fetcher("/api/settings/dekstop/get-strictpayment").then((res) => {
      setStrictPayment(!!res.data.stricpayment);
    });
  }, []);

  const fetchTunggalData = useCallback(async () => {
    if (!nopel || isPrinting.current) return;

    setIsLoadingTunggal(true);
    try {
      const formatTgl1 = format(date.start, "yyyyMM");
      const formatTgl2 = format(date.end, "yyyyMM");
      const url = `/api/pembayaran/cu-pembayaran-rekair/by-pelanggan?tgl1=${formatTgl1}&tgl2=${formatTgl2}&nopel=${nopel}`;
      const response = await fetcher(url);
      setTunggal(response);
      setErrorTunggal(null);
    } catch (error) {
      setErrorTunggal(error);
    } finally {
      setIsLoadingTunggal(false);
    }
  }, [nopel, tgl, isAdmin, fetcher]);

  useEffect(() => {
    fetchTunggalData();
  }, [fetchTunggalData]);

  const [colorIndexTunggal, setColorIndexTunggal] = useState<number>(0);
  const [allDataTunggal, setAllDataTunggal] = useState<
    CUDataPembayaranRekAir[]
  >([]);
  const [totalTunggal, setTotalTunggal] = useState(0);
  const [bayarTunggal, setBayarTunggal] = useState(0);
  const [kembalianTunggal, setKembalianTunggal] = useState(0);

  useEffect(() => {
    setKembalianTunggal(totalTunggal - bayarTunggal);
  }, [bayarTunggal, totalTunggal]);

  useEffect(() => {
    if (tunggal && !errorTunggal) {
      const colors = [
        { name: "merah", backgroundColor: "rgba(255, 0, 0, 0.2)" },
        { name: "kuning", backgroundColor: "rgba(255, 255, 0, 0.2)" },
        { name: "hijau", backgroundColor: "rgba(0, 128, 0, 0.2)" },
      ];
      if (tunggal.pelanggan.status === 0) {
        setModalAlertDesc("Pelanggan ini tidak aktif!");
        onOpen();
      }
      const currentColor = colors[colorIndexTunggal];
      const newItemsMap = new Map();
      tunggal.data.forEach((item) => {
        newItemsMap.set(item.id, {
          ...item,
          color: currentColor.backgroundColor,
        });
      });

      const filteredData = allDataTunggal.filter(
        (item) => !newItemsMap.has(item.id)
      );

      setAllDataTunggal([...filteredData, ...(newItemsMap.values() as any)]);

      if (tunggal.data.length > 0) {
        setColorIndexTunggal((colorIndexTunggal + 1) % colors.length);
      }
    }
  }, [tunggal]);

  useEffect(() => {
    let total = 0;
    allDataTunggal.forEach((data) => {
      total += Number(data.total);
    });
    setTotalTunggal(total);
  }, [allDataTunggal]);

  // !KOLEKTIF

  const [kolektif, setKolektif] = useState("");
  const [tglKolektif, setTglKolektif] = useState<CalendarDate>(
    today(getLocalTimeZone())
  );

  const [kolektifData, setKolektifData] = useState<{
    data: DataPembayaranRekAir[][];
    kolektif: Kolektif;
  } | null>(null);
  const [errorKolektif, setErrorKolektif] = useState<any>(null);
  const [isLoadingKolektif, setIsLoadingKolektif] = useState(false);
  const [selectedKolektif, setSelectedKolektif] = useState<
    CUDataPembayaranRekAir[]
  >([]);

  const fetchKolektifData = useCallback(async () => {
    if (!kolektif || isPrinting.current) return;

    setIsLoadingKolektif(true);
    try {
      const formatTgl1 = format(date.start, "yyyyMM");
      const formatTgl2 = format(date.end, "yyyyMM");

      const url = `/api/pembayaran/cu-pembayaran-rekair/by-kolektif?tgl1=${formatTgl1}&tgl2=${formatTgl2}&kolektif=${kolektif}&flag-is-admin=${isAdmin}`;
      const response = await fetcher(url);
      setKolektifData(response);
      setErrorKolektif(null);
    } catch (error) {
      setErrorKolektif(error);
    } finally {
      setIsLoadingKolektif(false);
    }
  }, [kolektif, tglKolektif, fetcher]);

  useEffect(() => {
    fetchKolektifData();
  }, [fetchKolektifData]);

  const [colorIndexKolektif, setColorIndexKolektif] = useState<number>(0);
  const [allDataKolektif, setAllDataKolektif] = useState<DataKolektif[]>([]);
  const [modalAlertDesc, setModalAlertDesc] = useState("");
  const [totalKolektif, setTotalKolektif] = useState(0);
  const [bayarKolektif, setBayarKolektif] = useState(0);
  const [kembalianKolektif, setKembalianKolektif] = useState(0);

  useEffect(() => {
    setKembalianKolektif(totalKolektif - bayarKolektif);
  }, [bayarKolektif, totalKolektif]);

  useEffect(() => {
    if (kolektifData && !errorKolektif) {
      const colors = [
        { name: "merah", backgroundColor: "rgba(255, 0, 0, 0.2)" },
        { name: "kuning", backgroundColor: "rgba(255, 255, 0, 0.2)" },
        { name: "hijau", backgroundColor: "rgba(0, 128, 0, 0.2)" },
      ];

      const allEmpty = kolektifData.data.every((arr) => arr.length === 0);
      if (allEmpty) {
        return addToast({
          color: "warning",
          title: "Tidak ada data tagihan pada nomor kolektif ini!",
        });
      }
      const newData: any = [];
      kolektifData.data.forEach((dataGroup, groupIndex) => {
        const currentColor =
          colors[(colorIndexKolektif + groupIndex) % colors.length];

        newData.push({
          data: dataGroup,
          color: currentColor.backgroundColor,
        });
      });

      const filteredData = allDataKolektif.filter(
        (item) => item.kolektif.id !== kolektifData.kolektif.id
      );

      setAllDataKolektif([
        ...filteredData,
        {
          data: newData,
          kolektif: kolektifData.kolektif,
        },
      ]);

      if (kolektifData.data.length > 0) {
        setColorIndexKolektif(
          (prevIndex) => (prevIndex + kolektifData.data.length) % colors.length
        );
      }
    }
  }, [kolektifData]);

  useEffect(() => {
    let total = 0;
    allDataKolektif.forEach((data) => {
      data.data.forEach((data) => {
        data.data.forEach((data) => {
          total += Number(data.total);
        });
      });
    });
    setTotalKolektif(total);
  }, [allDataKolektif]);
  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <BreadcrumbsComponent />
      <Tabs aria-label="Metode">
        <Tab key="tunggal" title="Tunggal">
          <h3 className="text-xl font-semibold">
            Pembayaran Rekening Air (Tunggal)
          </h3>
          <div>
            <div className="mt-5 flex justify-between">
              <div className="flex gap-5 items-center">
                <div className="w-64">
                  <ComboboxPelanggan
                    handler={(val) => {
                      setNopel(val);
                    }}
                    isLoading={isLoadingTunggal}
                    placeHolder="Pilih pelanggan..."
                  />
                </div>
                <div>
                  <AlertModal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    modalAlertDesc={modalAlertDesc}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm">Periode</p>
                <div className="flex justify-between items-center gap-5">
                  <div className="flex gap-5 items-center">
                    <MonthPicker
                      currentMonth={date.start}
                      onMonthChange={(val) => {
                        setDate((prev) => ({ ...prev, start: val }));
                      }}
                    />
                    <p>s/d</p>
                    <MonthPicker
                      currentMonth={date.end}
                      onMonthChange={(val) => {
                        setDate((prev) => ({ ...prev, end: val }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-5">
              {tunggal?.pelanggan && (
                <Card>
                  <CardHeader className="font-bold justify-center">
                    Informasi Pelanggan
                  </CardHeader>
                  <CardBody className="">
                    {!Boolean(tunggal.pelanggan.status) && (
                      <Alert color="danger" className="mb-5 text-center">
                        Pelanggan ini tidak aktif
                      </Alert>
                    )}
                    <div className="flex flex-row gap-5">
                      <div className="w-6/12">
                        <div className="flex justify-between">
                          <p className="font-bold">Nama</p>
                          <p>{tunggal.pelanggan.nama}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="font-bold">Rayon</p>
                          <p>{tunggal.pelanggan.rayon}</p>
                        </div>
                      </div>

                      <div className="w-6/12">
                        <div className="flex justify-between">
                          <p className="font-bold">Golongan</p>
                          <p>{tunggal.pelanggan.golongan}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="font-bold">Alamat</p>
                          <p>{tunggal.pelanggan.alamat}</p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}
              <DataTableTunggal
                data={allDataTunggal}
                strictPayment={strictPayment}
                setData={setAllDataTunggal}
                handler={(ids) => {
                  const filteredData = allDataTunggal.filter((item) =>
                    ids.includes(String(item.id))
                  );
                  setSelectedTunggal(filteredData);
                }}
              />
            </div>
            <div className="mt-5 flex justify-between">
              <div>
                <Button
                  color="warning"
                  className="h-full"
                  onPress={() => {
                    setTotalTunggal(0);
                    setBayarTunggal(0);
                    setIsAdmin(false);
                    setAllDataTunggal([]);
                    setSelectedTunggal([]);
                  }}
                >
                  Reset Tagihan
                </Button>
              </div>
              <div className="flex gap-5">
                <Input
                  disabled
                  value={formatRupiah(totalTunggal)}
                  variant="bordered"
                  label="Total Tagihan"
                />
                <Input
                  value={formatRupiah(bayarTunggal)}
                  onValueChange={(val) => {
                    const numericValue = val.replace(/\D/g, "");
                    setBayarTunggal(numericValue ? Number(numericValue) : 0);
                  }}
                  variant="bordered"
                  label="Bayar"
                />
                <Input
                  disabled
                  value={formatRupiah(kembalianTunggal)}
                  variant="bordered"
                  label="Kembalian"
                />
                <div>
                  <BayarHandler data={selectedTunggal} handler={() => {}} />
                </div>
              </div>
            </div>
          </div>
        </Tab>
        <Tab key="kolektif" title="Kolektif">
          <h3 className="text-xl font-semibold">
            Pembayaran Rekening Air (Kolektif)
          </h3>

          {/* KOLEKTIF */}
          <div>
            <div className="mt-5 flex justify-between">
              <div className="flex gap-5 items-center">
                <div className="w-64">
                  <ComboboxKolektif
                    handler={(val) => {
                      setKolektif(val);
                    }}
                    isLoading={isLoadingKolektif}
                    placeHolder="Pilih kolektif..."
                  />
                </div>
              </div>
              <div className="flex justify-between items-center gap-5">
                <div>
                  <p className="text-sm">Periode</p>
                  <div className="flex justify-between items-center gap-5">
                    <div className="flex gap-5 items-center">
                      <MonthPicker
                        currentMonth={date.start}
                        onMonthChange={(val) => {
                          setDate((prev) => ({ ...prev, start: val }));
                        }}
                      />
                      <p>s/d</p>
                      <MonthPicker
                        currentMonth={date.end}
                        onMonthChange={(val) => {
                          setDate((prev) => ({ ...prev, end: val }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-5">
              <DataTableKolektif
                data={allDataKolektif}
                handler={(ids) => {
                  const filteredData = allDataKolektif.filter((item) =>
                    item.data.some((subItem) =>
                      subItem.data.some((kolektif) =>
                        ids.includes(String(kolektif.id))
                      )
                    )
                  );

                  const selectedKolektif = filteredData.flatMap((item) =>
                    item.data.flatMap((subItem) =>
                      subItem.data.filter((kolektif) =>
                        ids.includes(String(kolektif.id))
                      )
                    )
                  );

                  setSelectedKolektif(selectedKolektif);
                }}
              />
            </div>
            <div className="mt-5 flex justify-between">
              <div>
                <Button
                  color="warning"
                  className="h-full"
                  onPress={() => {
                    setTotalKolektif(0);
                    setBayarKolektif(0);
                    setIsAdmin(false);
                    setAllDataKolektif([]);
                    setSelectedKolektif([]);
                  }}
                >
                  Reset Tagihan
                </Button>
              </div>
              <div className="flex gap-5">
                <Input
                  disabled
                  value={formatRupiah(totalKolektif)}
                  variant="bordered"
                  label="Total Tagihan"
                />
                <Input
                  value={formatRupiah(bayarKolektif)}
                  onValueChange={(val) => {
                    const numericValue = val.replace(/\D/g, "");
                    setBayarKolektif(numericValue ? Number(numericValue) : 0);
                  }}
                  variant="bordered"
                  label="Bayar"
                />
                <Input
                  disabled
                  value={formatRupiah(kembalianKolektif)}
                  variant="bordered"
                  label="Kembalian"
                />
                <div>
                  <BayarHandler data={selectedKolektif} handler={() => {}} />
                </div>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default PembayaranRekAir;
