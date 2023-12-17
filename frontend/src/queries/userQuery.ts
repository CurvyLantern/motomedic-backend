import { fetchUser } from "@/fetchers/fetchUser";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

export const userQuery = {
  queryKey: ["get/user"],
  queryFn: fetchUser,
  staleTime: 10000,
} satisfies UseQueryOptions;

export const useUserQuery = () => {
  const { data: user } = useQuery(userQuery);

  return user;
};
