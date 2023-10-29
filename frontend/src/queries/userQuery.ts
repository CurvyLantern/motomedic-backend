import { fetchUser } from "@/fetchers/fetchUser";
import { UseQueryOptions } from "@tanstack/react-query";

export const userQuery = {
  queryKey: ["get/user"],
  queryFn: fetchUser,
  staleTime: 10000,
} satisfies UseQueryOptions;
