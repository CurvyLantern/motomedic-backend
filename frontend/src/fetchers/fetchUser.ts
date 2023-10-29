import axiosClient from "@/lib/axios";
import { User } from "@/types/defaultTypes";
import { AxiosError, AxiosResponse } from "axios";
import { redirect } from "react-router";

export const fetchUser = async () => {
  const user = await axiosClient.v1.api.get("user").then<User>((res) => {
    return res.data;
  });
  if (user) {
    return user;
  } else {
    throw new Error("No user was found");
  }
};
