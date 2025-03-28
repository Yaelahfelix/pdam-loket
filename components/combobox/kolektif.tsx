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
import { cn } from "@/lib/utils";
import { Kolektif } from "@/types/kolektif";
import { useSearchParams } from "next/navigation";
import useUpdateQuery from "../hooks/useUpdateQuery";

export function ComboboxKolektif({
  handler,
  placeHolder = "Pilih kolektif...",
}: {
  handler: (value: string) => void;
  placeHolder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [kolektifList, setKolektifList] = useState<Kolektif[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const valueFromQuery = searchParams.get("kolektif_id");

  const fetchData = useCallback(async (searchQuery = "") => {
    try {
      setLoading(true);

      console.log("HITTT");

      const session = await getSession();

      const res = await axios.get(`/api/kolektif?q=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${session?.token.value}`,
        },
      });

      console.log("success");
      console.log(res);
      const data = await res.data.data;
      setKolektifList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setKolektifList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (value !== "") {
      const selectedKolektif = getSelectedKolektif();
      handler(String(selectedKolektif?.id) || "");
    }
  }, [value]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchData(value);
  };

  const getSelectedKolektif = () => {
    return kolektifList.find((k) => k.id.toString() === value);
  };

  const getSelectedLabel = () => {
    const selected = kolektifList.find((k) => k.id.toString() === value);
    return selected
      ? `${selected.nama} (${selected.no_kolektif})`
      : placeHolder;
  };

  useEffect(() => {
    const selected = kolektifList.find((k) => k.id.toString() === value);

    if (!valueFromQuery && selected) {
      setValue("");
    }
  }, [valueFromQuery]);

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
            placeholder="Cari nama atau no kolektif..."
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
            {loading && kolektifList.length === 0 ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Sedang mencari...</span>
              </div>
            ) : kolektifList.length === 0 ? (
              <div className="p-2 text-sm text-gray-500 text-center">
                Tidak ada kolektif ditemukan.
              </div>
            ) : (
              <ul>
                {kolektifList.map((kolektif) => (
                  <li
                    key={kolektif.id}
                    className={cn(
                      "px-2 py-2 hover:bg-gray-100 cursor-pointer rounded-md",
                      value === kolektif.id.toString() && "bg-blue-50"
                    )}
                    onClick={() => {
                      setValue(kolektif.id.toString());
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-medium">{kolektif.nama}</span>
                        <span className="text-xs text-gray-500">
                          {kolektif.no_kolektif} | {kolektif.telp}
                        </span>
                      </div>
                      {value === kolektif.id.toString() && (
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
