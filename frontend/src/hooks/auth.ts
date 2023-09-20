import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/lib/axios";
import { userQuery } from "@/queries/userQuery";
import { fetchCSRF } from "@/fetchers/fetchCSRF";
import { AxiosError } from "axios";
import { qc } from "@/providers/QueryProvider";
import { redirect } from "react-router";

export const useAuth = () => {
  // const navigate = useNavigate();
  /* if (error.response.status !== 409) throw error;

        router.push("/verify-email"); */
  const { data: user } = useQuery(userQuery);
  if (!user) {
    throw new Error("user should be present");
  }
  //   const resetPassword = async ({ setErrors, setStatus, ...props }) => {
  //     await fetchCsrf();

  //     setErrors([]);
  //     setStatus(null);

  //     axios
  //       .post("/reset-password", { token: router.query.token, ...props })
  //       .then((response) =>
  //         router.push("/login?reset=" + btoa(response.data.status))
  //       )
  //       .catch((error) => {
  //         if (error.response.status !== 422) throw error;

  //         setErrors(error.response.data.errors);
  //       });
  //   };

  //   const resendEmailVerification = ({ setStatus }) => {
  //     axios
  //       .post("/email/verification-notification")
  //       .then((response) => setStatus(response.data.status));
  //   };

  return {
    user,
  };
};

export const isAuthenticated = async () => {
  const user =
    qc.getQueryData(userQuery.queryKey) ?? (await qc.fetchQuery(userQuery));
  const isUserValid = Boolean(user);
  return isUserValid;
};

// export const forgotPassword = async ({ email }: { email: string }) => {
//   await fetchCsrf();

//   axiosClient
//     .post("/forgot-password", { email })
//     .then((response) => response.data)
//     .catch((error) => {
//       if (error.response.status !== 422) throw error;
//     });
// };
export const register = async (
    credentials:
        | {
              email: string;
              password: string;
              name: string;
              password_confirmation: string;
          }
        | FormData
) => {
    await fetchCSRF();

    return await axiosClient.v1.web
        .post("auth/register", credentials)
        .then((res) => {
            return res;
        });
};
export const login = async (
    credentials:
        | {
              email: string;
              password: string;
              remember: boolean;
          }
        | FormData
) => {
    try {
        await fetchCSRF();

        return await axiosClient.v1.web
            .post("auth/login", credentials)
            .then((res) => {
                return res.status;
            });
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.status === 401) {
            throw new Error("not authorized");
        }
        throw error;
    }
};
export const logout = async () => {
  try {
    const res = await axiosClient.v1.web.post("auth/logout");
    window.location.pathname = "/";
    return res;
  } catch (error) {
    console.error(error);
    window.location.pathname = "/";
  }
};
