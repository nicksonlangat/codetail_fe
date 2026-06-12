import { useQuery } from "@tanstack/react-query";
import { getRank } from "@/lib/api/auth";

export function useRank() {
  return useQuery({
    queryKey: ["rank"],
    queryFn: getRank,
    staleTime: 30_000,
  });
}
