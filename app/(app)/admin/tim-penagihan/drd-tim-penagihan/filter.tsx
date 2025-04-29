import { formatPeriode } from "@/lib/formatPeriode";
import fetcher from "@/lib/swr/fetcher";
import { Rayon } from "@/types/plot-tim-tagih";
import { User } from "@/types/user";
import {
  Button,
  Checkbox,
  DateRangePicker,
  Form,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { format } from "date-fns";
import { FormEventHandler, useEffect, useState } from "react";

interface Props {
  beforeFilter: () => void;
  onFilter: (filters: any) => void;
  onReset: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  periodData: string; // Format: YYYYMM
}

const Filter = ({ isLoading, setIsLoading, ...props }: Props) => {
  // Checkbox states
  const [isNosamb, setIsNosamb] = useState(false);
  const [isNama, setIsNama] = useState(false);
  const [isAlamat, setIsAlamat] = useState(false);
  const [isRayon, setIsRayon] = useState(false);
  const [isTimTagih, setIsTimTagih] = useState(false);
  const [isJmlRek, setIsJmlRek] = useState(false);
  const [isBayar, setIsBayar] = useState(false);
  const [isUserLunas, setIsUserLunas] = useState(false);
  const [isTanggalBayar, setIsTanggalBayar] = useState(false);
  const [isStatus, setIsStatus] = useState(false);
  const [isCabutan, setIsCabutan] = useState(false);
  const [isSambKbli, setIsSambKbli] = useState(false);

  // Value states
  const [noSamb, setNoSamb] = useState("");
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [rayon, setRayon] = useState("");
  const [timTagih, setTimTagih] = useState("");
  const [jmlRekMin, setJmlRekMin] = useState("0");
  const [jmlRekMax, setJmlRekMax] = useState("0");
  const [bayar, setBayar] = useState("belumbayar");
  const [userLunas, setUserLunas] = useState("");
  const [tanggalBayarStart, setTanggalBayarStart] = useState<string | null>(
    null
  );
  const [tanggalBayarEnd, setTanggalBayarEnd] = useState<string | null>(null);
  const [userOptions, setUserOptions] = useState<User[]>([]);
  const [timTagihOptions, setTimTagihOptions] = useState<User[]>([]);
  const [status, setStatus] = useState("aktif");
  const [cabutan, setCabutan] = useState("");
  const [sambKbli, setSambKbli] = useState("ya");
  const [rayonOptions, setRayonOptions] = useState<Rayon[]>([]);

  const cabutanOptions = ["Option 1", "Option 2"];

  useEffect(() => {
    fetcher("/api/info/user").then((res) => setUserOptions(res.data));
    fetcher("/api/info/tim-tagih").then((res) => setTimTagihOptions(res.data));
    fetcher("/api/info/rayon").then((res) => setRayonOptions(res.data));
  }, []);

  const handleApplyFilter: FormEventHandler<HTMLFormElement> = () => {
    setIsLoading(true);
    props.beforeFilter();
    const filters: any = {};

    if (isNosamb) filters.no_samb = noSamb;
    if (isNama) filters.nama = nama;
    if (isAlamat) filters.alamat = alamat;
    if (isRayon) filters.rayon = rayon;
    if (isTimTagih) filters.tim_tagih = timTagih;

    if (isJmlRek) {
      filters.jml_rek_min = jmlRekMin;
      filters.jml_rek_max = jmlRekMax;
    }

    if (isBayar) filters.bayar = bayar;
    if (isUserLunas) filters.user_lunas = userLunas;

    if (isTanggalBayar && tanggalBayarStart && tanggalBayarEnd) {
      filters.tgl_bayar_start = tanggalBayarStart;
      filters.tgl_bayar_end = tanggalBayarEnd;
    }

    if (isStatus) filters.status = status === "aktif" ? "1" : "0";
    if (isCabutan) filters.cabutan = cabutan;
    if (isSambKbli) filters.samb_kbli = sambKbli;

    props.onFilter(filters);
  };

  const handleReset = () => {
    setIsNosamb(false);
    setIsNama(false);
    setIsAlamat(false);
    setIsRayon(false);
    setIsTimTagih(false);
    setIsJmlRek(false);
    setIsBayar(false);
    setIsUserLunas(false);
    setIsTanggalBayar(false);
    setIsStatus(false);
    setIsCabutan(false);
    setIsSambKbli(false);

    // Reset all values
    setNoSamb("");
    setNama("");
    setAlamat("");
    setRayon("");
    setTimTagih("");
    setJmlRekMin("0");
    setJmlRekMax("0");
    setBayar("belumbayar");
    setUserLunas("");
    setStatus("aktif");
    setCabutan("");
    setSambKbli("ya");

    props.onReset();
  };

  return (
    <Form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        handleApplyFilter(e);
      }}
    >
      <div className="text-lg font-semibold mb-3">Filter & Pencarian Data</div>
      <div className="text-md font-medium mb-4">
        Periode: {formatPeriode(props.periodData)}
      </div>

      <div className="space-y-3 w-full">
        {/* No Samb Filter */}
        <div className="flex gap-5 items-center">
          <div className="w-32">
            <Checkbox isSelected={isNosamb} onValueChange={setIsNosamb}>
              No. Samb
            </Checkbox>
          </div>
          <Input
            isDisabled={!isNosamb}
            isRequired={isNosamb}
            value={noSamb}
            onValueChange={setNoSamb}
            className="max-w-md"
          />
        </div>

        {/* Nama Filter */}
        <div className="flex gap-5 items-center">
          <div className="w-32">
            <Checkbox isSelected={isNama} onValueChange={setIsNama}>
              Nama
            </Checkbox>
          </div>
          <Input
            isDisabled={!isNama}
            value={nama}
            isRequired
            onValueChange={setNama}
            className="max-w-md"
          />
        </div>

        {/* Alamat Filter */}
        <div className="flex gap-5 items-center">
          <div className="w-32">
            <Checkbox isSelected={isAlamat} onValueChange={setIsAlamat}>
              Alamat
            </Checkbox>
          </div>
          <Input
            isDisabled={!isAlamat}
            value={alamat}
            isRequired={isAlamat}
            onValueChange={setAlamat}
            className="max-w-md"
          />
        </div>

        {/* Rayon Filter */}
        <div className="flex gap-5 items-center">
          <div className="w-32">
            <Checkbox isSelected={isRayon} onValueChange={setIsRayon}>
              Rayon
            </Checkbox>
          </div>
          <Select
            isDisabled={!isRayon}
            value={rayon}
            isRequired={isRayon}
            onChange={(e) => setRayon(e.target.value)}
            className="max-w-md"
          >
            {rayonOptions.map((option) => (
              <SelectItem key={option.kode_rayon}>
                {option.kode_rayon}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Tim Tagih Filter */}
        <div className="flex gap-5 items-center">
          <div className="w-32">
            <Checkbox isSelected={isTimTagih} onValueChange={setIsTimTagih}>
              Tim Tagih
            </Checkbox>
          </div>
          <Select
            isDisabled={!isTimTagih}
            isRequired={isTimTagih}
            value={timTagih}
            onChange={(e) => setTimTagih(e.target.value)}
            className="max-w-md"
          >
            {timTagihOptions.map((option) => (
              <SelectItem key={option.nama}>{option.nama}</SelectItem>
            ))}
          </Select>
        </div>

        {/* Jml Rek Filter */}
        <div className="flex gap-5 items-center">
          <div className="w-32">
            <Checkbox isSelected={isJmlRek} onValueChange={setIsJmlRek}>
              Jml Rek
            </Checkbox>
          </div>
          <div className="flex items-center gap-2">
            <Input
              isDisabled={!isJmlRek}
              value={jmlRekMin}
              onValueChange={setJmlRekMin}
              isRequired={isJmlRek}
              type="number"
              className="w-24"
            />
            <span>s/d</span>
            <Input
              isDisabled={!isJmlRek}
              isRequired={isJmlRek}
              value={jmlRekMax}
              onValueChange={setJmlRekMax}
              type="number"
              className="w-24"
            />
          </div>
        </div>

        {/* Bayar Filter */}
        <div className="flex gap-5 items-center">
          <div className="w-32">
            <Checkbox isSelected={isBayar} onValueChange={setIsBayar}>
              Bayar
            </Checkbox>
          </div>
          <Select
            isDisabled={!isBayar}
            value={bayar}
            isRequired={isBayar}
            onChange={(e) => setBayar(e.target.value)}
            className="max-w-md"
          >
            <SelectItem key="belumbayar">Belum Bayar</SelectItem>
            <SelectItem key="sebagian">Sebagian</SelectItem>
            <SelectItem key="lunas">Lunas</SelectItem>
            <SelectItem key="sudahbayar">Sudah Bayar</SelectItem>
          </Select>
        </div>

        {/* User Lunas Filter */}
        <div className="flex gap-5 items-center">
          <div className="w-32">
            <Checkbox isSelected={isUserLunas} onValueChange={setIsUserLunas}>
              User Lunas
            </Checkbox>
          </div>
          <Select
            isDisabled={!isUserLunas}
            value={userLunas}
            isRequired={isUserLunas}
            onChange={(e) => setUserLunas(e.target.value)}
            className="max-w-md"
          >
            {userOptions.map((option) => (
              <SelectItem key={option.nama}>{option.nama}</SelectItem>
            ))}
          </Select>
        </div>

        {/* Tanggal Bayar Filter */}
        <div className="flex gap-5 items-center">
          <div className="w-32">
            <Checkbox
              isSelected={isTanggalBayar}
              onValueChange={setIsTanggalBayar}
            >
              Tanggal Bayar
            </Checkbox>
          </div>
          <DateRangePicker
            className=""
            label="Rentan Waktu"
            isDisabled={!isTanggalBayar}
            onChange={(tgl) => {
              if (!tgl?.start) return;
              const tgl1 = format(
                tgl?.start.toDate("Asia/Jakarta"),
                "yyyy-MM-dd"
              );
              const tgl2 = format(
                tgl?.end.toDate("Asia/Jakarta"),
                "yyyy-MM-dd"
              );
              setTanggalBayarStart(tgl1);
              setTanggalBayarEnd(tgl2);
            }}
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-5 items-center">
          <div className="w-32">
            <Checkbox isSelected={isStatus} onValueChange={setIsStatus}>
              Status
            </Checkbox>
          </div>
          <Select
            isDisabled={!isStatus}
            value={status}
            isRequired={isStatus}
            onChange={(e) => setStatus(e.target.value)}
            className="max-w-md"
          >
            <SelectItem key="aktif">Aktif</SelectItem>
            <SelectItem key="nonaktif">Non Aktif</SelectItem>
          </Select>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 w-full">
        <Button
          color="danger"
          variant="flat"
          onPress={handleReset}
          type="reset"
        >
          Reset
        </Button>
        <Button color="primary" type="submit" isLoading={isLoading}>
          Tampilkan
        </Button>
      </div>
    </Form>
  );
};

export default Filter;
