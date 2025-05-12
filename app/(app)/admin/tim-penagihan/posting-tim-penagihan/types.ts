export interface PostingBatch {
  selectedPeriod: string;
  totalPelanggan: number;
  totalBatches: number;
  batchSize: number;
  flagPostUlang: number;
}

export interface PostingBatchBackup extends PostingBatch {
  batchNumber: number;
  status: "ERROR" | "RUNNING" | "INIT";
}
