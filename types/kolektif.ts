export interface Kolektif {
  id: number;
  no_kolektif: string;
  nama: string;
  telp: string;
  pelanggan_array: Pelanggan[];
}

interface Pelanggan {
  no_pelanggan: string;
  nama_pelanggan: string;
}
