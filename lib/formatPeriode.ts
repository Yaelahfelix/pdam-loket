import { format, parse } from "date-fns";
import { id } from "date-fns/locale";

export function formatPeriode(periode: string) {
  if (!periode || periode.length !== 6) return "";

  const parsedDate = parse(periode, "yyyyMM", new Date());
  return format(parsedDate, "MMM yyyy", { locale: id });
}
