import { formatRupiah } from "@/lib/utils";
import {
  TagihanBlmLunasInfoPel,
  TagihanSdhLunasInfoPel,
  TotalTagihan,
} from "@/types/info-pelanggan";
import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface PelangganData {
  tagihanBlmLunas: TagihanBlmLunasInfoPel[];
  tagihanSdhLunas: TagihanSdhLunasInfoPel[];
  total: TotalTagihan;
}

interface KolektifData {
  kolektifBlmLunas: { tagihanBlmLunas: TagihanBlmLunasInfoPel[] }[];
  totalBlmLunas: string;
}

interface Props {
  pelangganData?: PelangganData;
  kolektifData?: KolektifData;
}

export const PelangganTable: React.FC<{ pelangganData: PelangganData }> = ({
  pelangganData,
}) => {
  console.log(pelangganData);
  return (
    <>
      <Card>
        <CardHeader className="font-bold justify-center">
          Informasi Pelanggan
        </CardHeader>
        <CardBody className="flex gap-5 p-5 flex-row">
          <div className="w-6/12">
            <div className="flex justify-between">
              <p className="font-bold">Nama</p>
              <p>{pelangganData.tagihanSdhLunas[0].nama}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Rayon</p>
              <p>{pelangganData.tagihanSdhLunas[0].rayon}</p>
            </div>
          </div>

          <div className="w-6/12">
            <div className="flex justify-between">
              <p className="font-bold">Golongan</p>
              <p>{pelangganData.tagihanSdhLunas[0].golongan}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Alamat</p>
              <p>{pelangganData.tagihanSdhLunas[0].alamat}</p>
            </div>
          </div>
        </CardBody>
      </Card>
      <Table>
        <TableHeader>
          <TableColumn width={100}>Lunas</TableColumn>
          <TableColumn width={150}>Kasir</TableColumn>
          <TableColumn width={100}>Loket</TableColumn>
          <TableColumn width={150}>Tgl Bayar</TableColumn>
          <TableColumn width={120}>Periode</TableColumn>
          <TableColumn width={100}>S. Lalu</TableColumn>
          <TableColumn width={100}>S. Skrg</TableColumn>
          <TableColumn width={100}>Pakai</TableColumn>
          <TableColumn width={120}>Tagihan</TableColumn>
          <TableColumn width={100}>Denda</TableColumn>
          <TableColumn width={100}>Materai</TableColumn>
          <TableColumn width={150}>Total</TableColumn>
        </TableHeader>
        <TableBody>
          {pelangganData.tagihanBlmLunas.map((data, i) => (
            <TableRow key={i}>
              <TableCell>
                <Checkbox isDisabled />
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{data.periode_rek}</TableCell>
              <TableCell>{data.stanlalu}</TableCell>
              <TableCell>{data.stanskrg}</TableCell>
              <TableCell>{data.pakaiskrg}</TableCell>
              <TableCell>{formatRupiah(data.rekair)}</TableCell>
              <TableCell>{formatRupiah(Number(data.denda1))}</TableCell>
              <TableCell>{formatRupiah(data.materai)}</TableCell>
              <TableCell>{formatRupiah(Number(data.totalrek))}</TableCell>
            </TableRow>
          ))}

          {
            pelangganData?.tagihanSdhLunas.map((data, i) => {
              return (
                <>
                  <TableRow key={i}>
                    <TableCell>
                      <Checkbox
                        isSelected={true}
                        defaultSelected={true}
                        isDisabled
                        color="success"
                      />
                    </TableCell>
                    <TableCell>{data.kasir}</TableCell>
                    <TableCell>{data.loket}</TableCell>
                    <TableCell>
                      {format(new Date(data.tglbayar), "dd MMM yyyy HH:mm:ss", {
                        locale: id,
                      })}
                    </TableCell>
                    <TableCell>{data.periode_rek}</TableCell>
                    <TableCell>{data.stanlalu}</TableCell>
                    <TableCell>{data.stanskrg}</TableCell>
                    <TableCell>{data.pakaiskrg}</TableCell>

                    <TableCell>{formatRupiah(data.rekair)}</TableCell>
                    <TableCell>{formatRupiah(Number(data.denda))}</TableCell>
                    <TableCell>{formatRupiah(data.meterai)}</TableCell>
                    <TableCell>{formatRupiah(Number(data.total))}</TableCell>
                  </TableRow>
                </>
              );
            }) as any
          }
        </TableBody>
      </Table>
      <Table hideHeader aria-label="Table footer with totals">
        <TableHeader className="sticky top-0">
          <TableColumn width={100}>Lunas</TableColumn>
          <TableColumn width={150}>Kasir</TableColumn>
          <TableColumn width={100}>Loket</TableColumn>
          <TableColumn width={150}>Tgl Bayar</TableColumn>
          <TableColumn width={120}>Periode</TableColumn>
          <TableColumn width={100}>S. Lalu</TableColumn>
          <TableColumn width={100}>S. Skrg</TableColumn>
          <TableColumn width={100}>Pakai</TableColumn>
          <TableColumn width={120}>Tagihan</TableColumn>
          <TableColumn width={100}>Denda</TableColumn>
          <TableColumn width={100}>Materai</TableColumn>
          <TableColumn width={150}>Total</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow className="font-bold bg-default-100">
            <TableCell colSpan={9}> </TableCell>
            <TableCell>Total Lunas {pelangganData?.total.sdhLunas}</TableCell>
            <TableCell>Total Tagihan {pelangganData?.total.blmLunas}</TableCell>
            <TableCell>
              Total Keseluruhan {pelangganData?.total.keseluruhan}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export const KolektifTable: React.FC<{ kolektifData: KolektifData }> = ({
  kolektifData,
}) => (
  <>
    <Table>
      <TableHeader>
        <TableColumn width={100}>No Pel</TableColumn>
        <TableColumn width={150}>Nama</TableColumn>
        <TableColumn width={100}>Alamat</TableColumn>
        <TableColumn width={150}>Periode</TableColumn>
        <TableColumn width={100}>S. Lalu</TableColumn>
        <TableColumn width={100}>S. Skrg</TableColumn>
        <TableColumn width={100}>Pakai</TableColumn>
        <TableColumn width={120}>Tagihan</TableColumn>
        <TableColumn width={100}>Denda</TableColumn>
        <TableColumn width={100}>Materai</TableColumn>
        <TableColumn width={150}>Total</TableColumn>
      </TableHeader>
      <TableBody>
        {
          kolektifData.kolektifBlmLunas.map((tagihan, i) =>
            tagihan.tagihanBlmLunas.map((data, j) => (
              <TableRow key={`${i}-${j}`}>
                <TableCell>{data.no_pelanggan}</TableCell>
                <TableCell>{data.nama}</TableCell>
                <TableCell>{data.alamat}</TableCell>
                <TableCell>{data.periode_rek}</TableCell>
                <TableCell>{data.stanlalu}</TableCell>
                <TableCell>{data.stanskrg}</TableCell>
                <TableCell>{data.pakaiskrg}</TableCell>
                <TableCell>{formatRupiah(data.rekair)}</TableCell>
                <TableCell>{formatRupiah(Number(data.denda1))}</TableCell>
                <TableCell>{formatRupiah(data.materai)}</TableCell>
                <TableCell>{formatRupiah(Number(data.totalrek))}</TableCell>
              </TableRow>
            ))
          ) as any
        }
      </TableBody>
    </Table>
    <Table hideHeader aria-label="Table footer with totals">
      <TableHeader className="sticky top-0">
        <TableColumn width={100}>Lunas</TableColumn>
        <TableColumn width={150}>Kasir</TableColumn>
        <TableColumn width={100}>Loket</TableColumn>
        <TableColumn width={150}>Tgl Bayar</TableColumn>
        <TableColumn width={120}>Periode</TableColumn>
        <TableColumn width={100}>S. Lalu</TableColumn>
        <TableColumn width={100}>S. Skrg</TableColumn>
        <TableColumn width={100}>Pakai</TableColumn>
        <TableColumn width={120}>Tagihan</TableColumn>
        <TableColumn width={100}>Denda</TableColumn>
        <TableColumn width={100}>Materai</TableColumn>
        <TableColumn width={150}>Total</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow className="font-bold bg-default-100">
          <TableCell colSpan={11}> </TableCell>
          <TableCell className="text-right">
            Total Belum Lunas {kolektifData.totalBlmLunas}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </>
);
