import { fetchUser } from "@/fetchers/fetchUser";
import { FetchQueryOptions } from "@tanstack/react-query";

export const userQuery = {
  queryKey: ["get/user"],
  queryFn: fetchUser,
} satisfies FetchQueryOptions;
