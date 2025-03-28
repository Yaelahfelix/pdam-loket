export interface TagihanBlmLunasInfoPel {
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

export interface TagihanSdhLunasInfoPel {
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
  periode: string;
}

export interface TotalTagihan {
  blmLunas: string;
  sdhLunas: string;
  keseluruhan: string;
}
