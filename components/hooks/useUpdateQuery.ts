"use client";

import { useRouter, useSearchParams } from "next/navigation";

const useUpdateQuery = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (newParams: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`?${params.toString()}`, { scroll: false });
  };
};

export default useUpdateQuery;
