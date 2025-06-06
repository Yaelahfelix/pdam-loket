export interface KoreksiPembayaran {
  id: number;
  no_pelanggan: string;
  periode_rek: string;
  bln: number;
  nama: string;
  alamat: string;
  rayon: string;
  stanangkat: number;
  kodegol: string;
  golongan: string;
  stanlalu: number;
  stanskrg: number;
  pakaiskrg: number;
  harga_air: number;
  airlimbah: number;
  administrasi: number;
  pemeliharaan: number;
  retribusi: number;
  pelayanan: number;
  angsuran: number;
  rekair: number;
  meterai: number;
  denda: number;
  total: number;
  kasir: string;
  loket: string;
  tglbayar: string;
  loket_id: number;
  user_id: number;
}
