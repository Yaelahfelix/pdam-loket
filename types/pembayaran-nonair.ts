export interface DataNonair {
  jenisnonair: string;
  jenisnonairid: number;
  no_regis?: string;
  no_rab?: string;
  namajenis: string;
  nama: string;
  alamat: string;
  pendaftaranpel_id: number;
  pelayananlain_id: number;
  pasangbaru_id: number;
  jumlah: number;
  ppn: number;
  total: number;
  angsuran_id: number;
  periode: string;
  kode: string;
  ket: string;
}

export interface DataPrintNonAir {
  id: number;
  no_pembayaran: string;
  tglbayar: string;
  jenisnonair_id: number;
  jenisnonair: string;
  namajenis: string;
  nama: string;
  alamat: string;
  user_id: number;
  nama_user: string;
  pendaftaranpel_id: number;
  pelayananlain_id: number;
  pasangbaru_id: number;
  jumlah: number;
  ppn: number;
  total: number;
  loket_id: number;
  kode_loket: string;
  nama_loket: string;
  angsuran_id: number;
  periode_agbjt: number;
  created_at: string;
  updated_at: string;
  flagproses: number;
  keterangan: string;
  nohublang: string;
  loketbayar: string;
  namauser: string;
  no_pelanggan: string;
}

export interface ComboboxPembayaranNonAir {
  id: number;
  no_pembayaran: string;
  tglbayar: string;
  jenisnonair_id: number;
  jenisnonair: string;
  namajenis: string;
  nama: string;
  alamat: string;
  user_id: number;
  nama_user: string;
  pendaftaranpel_id: null;
  pelayananlain_id: number;
  pasangbaru_id: null;
  jumlah: number;
  ppn: number;
  total: number;
  loket_id: number;
  kode_loket: string;
  nama_loket: string;
  angsuran_id: null;
  periode_agbjt: null;
  created_at: string;
  updated_at: string;
  flagproses: number;
  keterangan: string;
  kasir: string;
}
