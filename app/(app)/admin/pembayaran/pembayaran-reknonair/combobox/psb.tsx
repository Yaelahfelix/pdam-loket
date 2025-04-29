"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import axios from "axios";
import { getSession } from "@/lib/session";
import { cn, formatRupiah } from "@/lib/utils";
import { Kolektif } from "@/types/kolektif";
import { usePathname, useSearchParams } from "next/navigation";
import { DataNonair } from "@/types/pembayaran-nonair";

export function ComboboxByPsb({
  handler,
  placeHolder = "Pilih dari pasang baru...",
  allData,
  isLoading = false,
}: {
  handler: (value: DataNonair | undefined) => void;
  allData: DataNonair[];

  placeHolder?: string;
  isLoading?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [data, setData] = useState<DataNonair[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();

  const pathname = usePathname();
  const fetchData = useCallback(async (searchQuery = "") => {
    try {
      setLoading(true);

      const session = await getSession();

      const res = await axios.get(
        `/api/pembayaran/pembayaran-nonair/by-pasangbaru?q=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${session?.token.value}`,
          },
        }
      );

      const data = await res.data.data;
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (allData.length === 0) {
      fetchData();
    }
  }, [fetchData, allData]);

  useEffect(() => {
    if (value !== "") {
      const selectedData = getSelectedData();
      setValue("");
      handler(selectedData);
    }
  }, [value]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchData(value);
  };

  const getSelectedData = () => {
    return data.find((k) => k.pasangbaru_id.toString() === value);
  };

  const getSelectedLabel = () => {
    const selected = data.find((k) => k.pasangbaru_id.toString() === value);
    return selected ? `${selected.nama}` : placeHolder;
  };

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom">
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          className="w-full justify-between"
          type="button"
          variant="bordered"
          isDisabled={isLoading}
          onPress={() => {
            setIsOpen(true);
          }}
        >
          {getSelectedLabel()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <div className="p-2 w-full">
          <Input
            type="text"
            placeholder="Cari pasang baru..."
            value={searchTerm}
            onChange={handleSearch}
            endContent={
              loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4 text-gray-400" />
              )
            }
          />

          <div className="max-h-60 overflow-auto">
            {loading && data.length === 0 ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Sedang mencari...</span>
              </div>
            ) : data.length === 0 ? (
              <div className="p-2 text-sm text-gray-500 text-center">
                Tidak ada pasang baru ditemukan.
              </div>
            ) : (
              <ul>
                {data.map((data) => (
                  <li
                    key={data.pasangbaru_id}
                    className={cn(
                      "px-2 py-2 hover:bg-gray-100 cursor-pointer rounded-md",
                      value === data.pasangbaru_id.toString() && "bg-blue-50"
                    )}
                    onClick={() => {
                      setValue(data.pasangbaru_id.toString());
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {data.no_rab} - {data.nama}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatRupiah(data.jumlah)} - {data.alamat}
                        </span>
                      </div>
                      {value === data.pasangbaru_id.toString() && (
                        <Check className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
