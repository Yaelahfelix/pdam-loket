"use client";

import { useCallback, useEffect, useState, useRef } from "react";
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
import { UserParaf } from "@/types/ttd";

// Helper untuk debounce
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export function ComboboxUserParaf({
  handler,
  placeHolder = "Pilih paraf...",
  defaultValue = "",
}: {
  handler: (value: string) => void;
  placeHolder?: string;
  defaultValue?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [userList, setUserList] = useState<UserParaf[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const isMounted = useRef(false);
  const fetchController = useRef<AbortController | null>(null);
  const initialDefaultValue = useRef(defaultValue);

  const fetchData = useCallback(async (searchQuery = "") => {
    if (fetchController.current) {
      fetchController.current.abort();
    }

    fetchController.current = new AbortController();

    try {
      setLoading(true);

      const session = await getSession();
      if (!session?.token?.value) {
        console.error("No session token found");
        return;
      }

      const res = await axios.get(`/api/user-paraf?q=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${session.token.value}`,
        },
        signal: fetchController.current.signal,
      });

      const data: UserParaf[] = res.data.data;
      setUserList(data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error("Error fetching data:", error);
        setUserList([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;

    fetchData("");

    return () => {
      isMounted.current = false;
      if (fetchController.current) {
        fetchController.current.abort();
      }
    };
  }, [fetchData]);

  useEffect(() => {
    if (initialDefaultValue.current && userList.length > 0) {
      const defaultUser = userList.find(
        (user) => user.id.toString() === initialDefaultValue.current
      );

      if (defaultUser) {
        setValue(initialDefaultValue.current);

        if (isMounted.current) {
          handler(initialDefaultValue.current);
        }

        initialDefaultValue.current = "";
      }
    }
  }, [userList, handler]);

  useEffect(() => {
    if (debouncedSearchTerm !== undefined) {
      fetchData(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, fetchData]);

  useEffect(() => {
    if (isMounted.current) {
      handler(value);
    }
  }, [value, handler]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
  };

  const getSelectedLabel = (): string => {
    const selected = userList.find((p) => p.id.toString() === value);
    return selected ? `${selected.nama}` : placeHolder;
  };

  const handleSelect = (userId: string) => {
    setValue(userId);
    setIsOpen(false);
  };

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom">
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          variant="faded"
          className="w-full justify-between"
          type="button"
          onPress={() => {
            setIsOpen(!isOpen);
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
            placeholder="Cari paraf..."
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
            ) : userList.length === 0 ? (
              <div className="p-2 text-sm text-gray-500 text-center">
                Tidak ditemukan.
              </div>
            ) : (
              <ul>
                {userList.map((user) => (
                  <li
                    key={user.id}
                    className={cn(
                      "px-2 py-2 hover:bg-gray-100 cursor-pointer rounded-md",
                      value === user.id.toString() && "bg-blue-50"
                    )}
                    onClick={() => handleSelect(user.id.toString())}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-medium">{user.nama}</span>
                        <span className="text-xs text-gray-500">
                          {user.jabatan}
                        </span>
                      </div>
                      {value === user.id.toString() && (
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
