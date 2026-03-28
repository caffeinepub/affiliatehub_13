import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Offer {
    title: string;
    description: string;
    category: string;
    commissionPercentage: bigint;
}
export interface Deal {
    badgeLabel: string;
    title: string;
    tagLabel: string;
}
export interface backendInterface {
    getAllDeals(): Promise<Array<Deal>>;
    getAllOffers(): Promise<Array<Offer>>;
    getTotalAffiliatesJoined(): Promise<bigint>;
    getTotalOffersAvailable(): Promise<bigint>;
    getTotalPayoutsMade(): Promise<bigint>;
}
