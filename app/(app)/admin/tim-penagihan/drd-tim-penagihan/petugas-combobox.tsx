"use client";

import { Pelanggan } from "@/types/pelanggan";
import { useCallback, useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { Petugas } from "@/types/plot-tim-tagih";

export function ComboboxPetugas({
  handler,
  isLoading = false,
  placeHolder = "Pilih petugas...",
}: {
  handler: (id?: number) => void;
  placeHolder?: string;
  isLoading?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [dataList, setDataList] = useState<Petugas[]>([]);
  const [loading, setLoading] = useState(false);
  const [filteredList, setFilteredList] = useState<Petugas[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();

  // Fetch data once on component mount
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const session = await getSession();
      const res = await axios.get(`/api/tim-penagihan/plot-tim-tagih/petugas`, {
        headers: {
          Authorization: `Bearer ${session?.token.value}`,
        },
      });

      const data: Petugas[] = await res.data.data;
      setDataList(data);
      setFilteredList(data);

      // print muncul
    } catch (error) {
      console.error("Error fetching data:", error);
      setDataList([]);
      setFilteredList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const selected = dataList.find((p) => p.id.toString() === value);
  }, [dataList, value]);

  useEffect(() => {
    if (value !== "") {
      const selectedPelanggan = getSelectedData();
      handler(selectedPelanggan?.id);
    }
  }, [value, handler]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredList(dataList);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = dataList.filter(
        (p) =>
          p.nama.toLowerCase().includes(lowercasedSearch) ||
          p.jabatan.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredList(filtered);
    }
  }, [searchTerm, dataList]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const getSelectedData = (): Petugas | undefined => {
    return dataList.find((p) => p.id.toString() === value);
  };

  const getSelectedLabel = (): string => {
    const selected = dataList.find((p) => p.id.toString() === value);
    return selected ? `${selected.nama} - (${selected.jabatan})` : placeHolder;
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
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Sedang mencari...</span>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="p-2 text-sm text-gray-500 text-center">
                Tidak ada pelanggan ditemukan.
              </div>
            ) : (
              <ul>
                {filteredList.map((pelanggan) => (
                  <li
                    key={pelanggan.id}
                    className={cn(
                      "px-2 py-2 hover:bg-gray-100 cursor-pointer rounded-md",
                      value === pelanggan.id.toString() && "bg-blue-50"
                    )}
                    onClick={() => {
                      setValue(pelanggan.id.toString());
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-medium">{pelanggan.nama}</span>
                        <span className="text-xs text-gray-500">
                          {pelanggan.jabatan}
                        </span>
                      </div>
                      {value === pelanggan.id.toString() && (
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
