"use client";

import { Pelanggan } from "@/types/pelanggan";
import { useCallback, useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn, formatRupiah } from "@/lib/utils";
import axios from "axios";
import { getSession } from "@/lib/session";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { UserParaf } from "@/types/ttd";
import { ComboboxPembayaranNonAir } from "@/types/pembayaran-nonair";
import { useDebounce } from "use-debounce";

export function ComboboxNonAir({
  handler,
  isLoading,
  placeHolder = "Pilih pembayaran...",
}: {
  handler: (value: string | undefined) => void;
  isLoading: boolean;
  placeHolder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");

  const [data, setData] = useState<ComboboxPembayaranNonAir[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [qDebounce] = useDebounce(searchTerm, 1000);
  const searchParams = useSearchParams();
  const fetchData = useCallback(async (searchQuery = "") => {
    try {
      setLoading(true);

      const session = await getSession();
      const res = await axios.get(`/api/pembayaran-nonair?q=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${session?.token.value}`,
        },
      });

      const data: ComboboxPembayaranNonAir[] = await res.data.data;
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (value !== "") {
      const selectedPelanggan = getSelectedPelanggan();
      handler(selectedPelanggan?.no_pembayaran);
    }
  }, [value]);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  useEffect(() => {
    fetchData(qDebounce);
  }, [qDebounce]);

  const getSelectedPelanggan = (): ComboboxPembayaranNonAir | undefined => {
    return data.find((p) => p.id.toString() === value);
  };

  const getSelectedLabel = (): string => {
    const selected = data.find((p) => p.id.toString() === value);
    return selected
      ? `${selected.no_pembayaran} - ${selected.nama}`
      : placeHolder;
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
            placeholder="Cari nama atau no pelanggan..."
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
                Tidak ada pelanggan ditemukan.
              </div>
            ) : (
              <ul>
                {data.map((pembayaran) => (
                  <li
                    key={pembayaran.id}
                    className={cn(
                      "px-2 py-2 hover:bg-gray-100 cursor-pointer rounded-md",
                      value === pembayaran.id.toString() && "bg-blue-50"
                    )}
                    onClick={() => {
                      setValue(pembayaran.id.toString());
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {pembayaran.no_pembayaran} - {pembayaran.nama}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatRupiah(pembayaran.total)}
                        </span>
                      </div>
                      {value === pembayaran.id.toString() && (
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
