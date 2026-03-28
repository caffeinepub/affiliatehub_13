import { useQuery } from "@tanstack/react-query";
import type { Deal, Offer } from "../backend.d";
import { useActor } from "./useActor";

export function useGetOffers() {
  const { actor, isFetching } = useActor();
  return useQuery<Offer[]>({
    queryKey: ["offers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOffers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDeals() {
  const { actor, isFetching } = useActor();
  return useQuery<Deal[]>({
    queryKey: ["deals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDeals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStats() {
  const { actor, isFetching } = useActor();
  return useQuery<{
    totalAffiliates: bigint;
    totalOffers: bigint;
    totalPayouts: bigint;
  }>({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor)
        return { totalAffiliates: 0n, totalOffers: 0n, totalPayouts: 0n };
      const [totalAffiliates, totalOffers, totalPayouts] = await Promise.all([
        actor.getTotalAffiliatesJoined(),
        actor.getTotalOffersAvailable(),
        actor.getTotalPayoutsMade(),
      ]);
      return { totalAffiliates, totalOffers, totalPayouts };
    },
    enabled: !!actor && !isFetching,
  });
}
