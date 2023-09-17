import axiosClient from "@/lib/axios";
import { AxiosError, AxiosResponse } from "axios";

export const fetchUser = async () => {
  return await axiosClient.v1.api
    .get("user")
    .then<User>((res) => {
      return res.data;
    })
    .catch((error) => {
      const axiosError = error as AxiosResponse;
      const msg = (error?.data as unknown as { message: string }).message;
      throw new Error(msg ?? "Something went wrong");
    });
};
