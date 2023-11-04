import AuthenticatedLayout, {
  authenticatedLoader,
} from "@/layouts/AuthenticatedLayout";
import { guestLayoutLoader } from "@/layouts/GuestLayout";
import ForgotPasswordPage, {
  forgotPasswordLoader,
} from "@/pages/guest/ForgotPasswordPage";
import LoginPage, { loginLoader } from "@/pages/guest/LoginPage";
import RegisterPage, { registerLoader } from "@/pages/guest/RegisterPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { redirect, type RouteObject } from "react-router-dom";

const routes: RouteObject[] = [
  {
    // element: <GuestLayout />,
    lazy: async () => {
      const GuestLayout = (await import("@/layouts/GuestLayout")).default;
      return {
        element: <GuestLayout />,
      };
    },
    loader: guestLayoutLoader,
    path: "/auth",
    children: [
      {
        path: "",
        loader: () => {
          return redirect("login");
        },
      },
      {
        path: "login",
        element: <LoginPage />,
        loader: loginLoader,
      },
      {
        path: "register",
        element: <RegisterPage />,
        loader: registerLoader,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
        loader: forgotPasswordLoader,
      },
    ],
  },
  {
    element: <AuthenticatedLayout />,
    loader: authenticatedLoader,
    children: [
      {
        path: "/",
        loader: () => {
          return redirect("/dashboard");
        },
      },
      {
        path: "pos",
        // element: <PosPage />,
        lazy: async () => {
          const module = await import("@/pages/pos/PosPage");
          const PosPage = module.default;
          return {
            element: <PosPage />,
          };
        },
      },
      {
        path: "dashboard",
        lazy: async () => {
          const Page = (await import("@/pages/DashboardPage")).default;
          return {
            element: <Page />,
          };
        },
      },
      {
        path: "product",
        children: [
          {
            path: "add",
            // element: <AddProductPage />,
            lazy: async () => {
              const Page = (await import("@/pages/product/AddProductPage"))
                .default;
              return {
                element: <Page />,
              };
            },
          },
          {
            path: "all",
            // element: <AllProductPage />,
            lazy: async () => {
              const Page = (await import("@/pages/product/AllProductPage"))
                .default;
              return {
                element: <Page />,
              };
            },
          },
          {
            path: "brands",
            // element: <BrandPage />,
            lazy: async () => {
              const Page = (await import("@/pages/product/BrandPage")).default;
              return {
                element: <Page />,
              };
            },
          },
          {
            path: "categories",
            // element: <CategoryPage />,
            lazy: async () => {
              const Page = (await import("@/pages/product/CategoryPage"))
                .default;
              return {
                element: <Page />,
              };
            },
          },
          {
            path: "attributes",
            // element: <AttributePage />,

            lazy: async () => {
              const Page = (await import("@/pages/product/AttributePage"))
                .default;
              return {
                element: <Page />,
              };
            },
          },
          {
            path: "models",
            // element: <ColorPage />,

            lazy: async () => {
              const Page = (await import("@/pages/product/ModelPage")).default;
              return {
                element: <Page />,
              };
            },
          },
          {
            path: "colors",
            // element: <ColorPage />,

            lazy: async () => {
              const Page = (await import("@/pages/product/ColorPage")).default;
              return {
                element: <Page />,
              };
            },
          },
          {
            path: ":productSku",
            lazy: async () => {
              const Page = (await import("@/pages/product/SingleProductView"))
                .default;
              return {
                element: <Page />,
              };
            },
          },
          {
            path: ":productSku/edit",
            lazy: async () => {
              const Page = (await import("@/pages/product/EditProductForm"))
                .default;
              return {
                element: <Page />,
              };
            },
          },
        ],
      },
      {
        path: "invoice",
        children: [
          {
            path: "all",
            // element: <AllInvoicePage />,
            lazy: async () => {
              const Page = (await import("@/pages/invoice/AllInvoicePage"))
                .default;
              return {
                element: <Page />,
              };
            },
          },
        ],
      },
      {
        path: "inventory",
        children: [
          {
            path: "all",
            // element: <AllInventoryPage />,
            lazy: async () => {
              const Page = (await import("@/pages/inventory/AllInventory"))
                .default;
              return {
                element: <Page />,
              };
            },
          },
          {
            path: "add",
            // element: <CreateInventoryPage />,
            lazy: async () => {
              const Page = (
                await import("@/pages/inventory/CreateInventoryPage")
              ).default;
              return {
                element: <Page />,
              };
            },
          },
        ],
      },
      {
        path: "order",
        children: [
          {
            path: "new",
            // element: <OrderPage />,
            lazy: async () => {
              const Page = (await import("@/pages/sales/NewOrderPage")).default;
              return {
                element: <Page />,
              };
            },
          },
          {
            path: "all",
            // element: <OrderPage />,
            lazy: async () => {
              const Page = (await import("@/pages/sales/OrderPage")).default;
              return {
                element: <Page />,
              };
            },
          },
          {
            path: "process",
            // element: <CreateBillingPage />,
            lazy: async () => {
              const Page = (await import("@/pages/billing/CreateBillingPage"))
                .default;
              return {
                element: <Page />,
              };
            },
          },
        ],
      },
      {
        path: "service",
        children: [
          {
            path: "",
            lazy: async () => {
              const Page = (await import("@/pages/service/CreateServicePage"))
                .default;
              return {
                element: <Page />,
              };
            },
          },
          {
            path: "packages",
            lazy: async () => {
              const Page = (await import("@/pages/service/PackagePage"))
                .default;
              return {
                element: <Page />,
              };
            },
          },
        ],
      },
      // {
      //   path: "billing",
      //   children: [
      //     {
      //       path: "add",
      //       element: <CreateBillingPage />,
      //     },
      //   ],
      // },
      {
        path: "vendors",
        lazy: async () => {
          const Page = (await import("@/pages/vendor/VendorPage")).default;
          return {
            element: <Page />,
          };
        },
      },
      {
        path: "customers",
        // element: <CustomerPage />,
        lazy: async () => {
          const Page = (await import("@/pages/customers/CustomerPage")).default;
          return {
            element: <Page />,
          };
        },
      },
      {
        path: "mechanic",
        children: [
          {
            path: "all",
            // element: <MechanicPage />,
            lazy: async () => {
              const Page = (await import("@/pages/mechanic/MechanicPage"))
                .default;
              return {
                element: <Page />,
              };
            },
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
    // errorElement: <NotFoundPage />,
  },
];

export default routes;
