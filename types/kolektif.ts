export interface Kolektif {
  id: number;
  no_kolektif: string;
  nama: string;
  telp: string;
  pelanggan_array: KolektifPelanggan[];
}

export interface KolektifPelanggan {
  id: number;
  no_pelanggan: string;
  kolektif_id: number;
  nama_pelanggan: string;
}
