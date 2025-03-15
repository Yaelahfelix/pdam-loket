"use client";

import { Kolektif } from "@/types/kolektif";
import { Accordion, AccordionItem, Alert, Divider } from "@heroui/react";

export const tableDetail = (kolektif: Kolektif) => {
  return (
    <div className="p-4">
      <div>
        <h4 className="font-semibold">Detail Data Kolektif Pelanggan</h4>
      </div>
      <Divider className="my-3" />
      <div className="flex gap-3 flex-wrap justify-around">
        {kolektif.pelanggan_array?.map((pelanggan) => (
          <Alert
            color="primary"
            title={pelanggan.no_pelanggan}
            description={pelanggan.nama_pelanggan}
            hideIcon
            className="max-w-fit"
          />
        ))}
      </div>
    </div>
  );
};

export const canTableDetail = (kolektif: Kolektif) => {
  return (
    kolektif.pelanggan_array?.length !== 0 && kolektif.pelanggan_array !== null
  );
};
