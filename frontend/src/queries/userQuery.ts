import { fetchUser } from "@/fetchers/fetchUser";
import {
    FetchQueryOptions,
    QueryOptions,
    UseQueryOptions,
    useQuery,
} from "@tanstack/react-query";

export const userQuery = {
    queryKey: ["get/user"],
    queryFn: fetchUser,
    staleTime: 1000,
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
} satisfies UseQueryOptions;
