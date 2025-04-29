export interface Rayon {
  id: number;
  kode_rayon: string;
  nama: string;
  wilayah_id: number;
  created_at: string;
  updated_at: string;
  aktif: number;
  jumlah: number;
}

export interface Petugas {
  id: number;
  nama: string;
  jabatan: string;
}

export interface DataRayonPetugas {
  id: number;
  rayon_id: number;
  kode_rayon: string;
  nama: string;
  jumlah: number;
}
