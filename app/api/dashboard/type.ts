export interface DashboardResponse {
  data: Data;
  total: Total;
}

export interface BacameterResponse {
  status: number;
  data: Datum[];
  total: TotalBC;
}

interface TotalBC {
  sudahbaca: number;
  belumbaca: number;
  jumlahdrd: number;
}

interface Datum {
  sudahbaca: string;
  jumlahdrd: string;
  belumbaca: string;
  petugas_plot: string;
}

interface Total {
  penerimaanUang: string;
  efesiensi: Efesiensi;
  pelangganBaru: number;
  piutang: number;
}

interface Efesiensi {
  jumlahLunas: string;
  jumlahBelumLunas: string;
}

interface Data {
  pelBaru: PelBaru[];
  piutang: Piutang[];
}

interface Piutang {
  total: string;
  kodegol: string;
  golongan: string;
}

interface PelBaru {
  nopel: string;
  nama: string;
  alamat: string;
  tglPasang: string;
  total: number;
}
