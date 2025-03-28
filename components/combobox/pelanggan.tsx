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

export function ComboboxPelanggan({
  handler,
  placeHolder = "Pilih pelanggan...",
}: {
  handler: (value: string) => void;
  placeHolder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [pelangganList, setPelangganList] = useState<Pelanggan[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const valueFromQuery = searchParams.get("no-pelanggan");
  const fetchData = useCallback(async (searchQuery = "") => {
    try {
      setLoading(true);

      const session = await getSession();
      const res = await axios.get(`/api/pelanggan?q=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${session?.token.value}`,
        },
      });

      const data: Pelanggan[] = await res.data.data;
      setPelangganList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setPelangganList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const selected = pelangganList.find((p) => p.id.toString() === value);

    if (!valueFromQuery && selected) {
      setValue("");
    }
  }, [valueFromQuery]);

  useEffect(() => {
    if (value !== "") {
      const selectedPelanggan = getSelectedPelanggan();
      handler(selectedPelanggan?.no_pelanggan || "");
    }
  }, [value]);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchData(value);
  };

  const getSelectedPelanggan = (): Pelanggan | undefined => {
    return pelangganList.find((p) => p.id.toString() === value);
  };

  const getSelectedLabel = (): string => {
    const selected = pelangganList.find((p) => p.id.toString() === value);
    return selected
      ? `${selected.nama} (${selected.no_pelanggan})`
      : placeHolder;
  };

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom">
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          className="w-full justify-between"
          type="button"
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
            {loading && pelangganList.length === 0 ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Sedang mencari...</span>
              </div>
            ) : pelangganList.length === 0 ? (
              <div className="p-2 text-sm text-gray-500 text-center">
                Tidak ada pelanggan ditemukan.
              </div>
            ) : (
              <ul>
                {pelangganList.map((pelanggan) => (
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
                          {pelanggan.no_pelanggan} |{" "}
                          {pelanggan.alamat.substring(0, 30)}
                          {pelanggan.alamat.length > 30 ? "..." : ""}
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
