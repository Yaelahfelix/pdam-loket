export interface TagihanPelcoklit {
  no_pelanggan: string;
  tagihan: Tagihan[];
}

interface Tagihan {
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
  tglmulaidenda: string;
  tglmulaidenda2: string;
  urut: number;
  denda1: string;
  denda2: number;
  materai: number;
  totalrek: string;
}
