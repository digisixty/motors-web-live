import type { CarListingDto } from "@workspace/api";

export type TCar = CarListingDto;

export type CarListingsResponse = {
  items: TCar[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};
