export interface DRDNonAir {
  no: number;
  id: number;
  no_pembayaran: string;
  tglbayar: string;
  jenisnonair: string;
  nama: string;
  alamat: string;
  jumlah: number;
  ppn: string;
  total: string;
  kasir: string;
  nama_loket: string;
  tagihan: string;
}

export interface TotalDRNonAir {
  tagihan: string;
  ppn: string;
  keseluruhan: string;
}
