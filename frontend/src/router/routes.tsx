import { redirect, type RouteObject } from "react-router-dom";
import GuestLayout, { guestLayoutLoader } from "@/layouts/GuestLayout";
import LoginPage, { loginLoader } from "@/pages/guest/LoginPage";
import RegisterPage, { registerLoader } from "@/pages/guest/RegisterPage";
import ForgotPasswordPage, {
  forgotPasswordLoader,
} from "@/pages/guest/ForgotPasswordPage";
import NotFoundPage from "@/pages/NotFoundPage";
import AuthenticatedLayout, {
  authenticatedLoader,
} from "@/layouts/AuthenticatedLayout";
import { qc } from "@/providers/QueryProvider";
import AddProductPage from "@/pages/product/AddProductPage";
import AllProductPage from "@/pages/product/AllProductPage";
import BrandPage from "@/pages/product/BrandPage";
import AttributePage from "@/pages/product/AttributePage";
import ColorPage from "@/pages/product/ColorPage";
import OrderPage from "@/pages/sales/OrderPage";
import CreateServicePage from "@/pages/service/CreateServicePage";
import CategoryPage from "@/pages/product/CategoryPage";
import CreateOrderPage from "@/pages/sales/CreateOrderPage";
import CreateInventoryPage from "@/pages/inventory/CreateInventoryPage";
import CreateInvoicePage from "@/pages/invoice/CreateInvoicePage";
import AllInvoicePage from "@/pages/invoice/AllInvoicePage";
import RootErrorBoundary from "@/components/erorrBoundary/RootErrorBoundary";
import AllInventoryPage from "@/pages/inventory/AllInventory";
import CreateBillingPage from "@/pages/billing/CreateBillingPage";
import PosPage from "@/pages/pos/PosPage";
import CustomerPage from "@/pages/customers/CustomerPage";

const routes: RouteObject[] = [
  {
    element: <GuestLayout />,
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
        loader: () => {
          return redirect("/dashboard");
        },
        path: "/",
      },
      {
        path: "pos",
        element: <PosPage />,
      },
      {
        path: "dashboard",
        lazy: async () => {
          const module = await import("@/pages/DashboardPage");
          const DashboardPage = module.default;
          return {
            element: <DashboardPage />,
          };
        },
      },
      {
        path: "product",
        children: [
          {
            path: "add",
            element: <AddProductPage />,
          },
          {
            path: "all",
            element: <AllProductPage />,
          },
          {
            path: "brands",
            element: <BrandPage />,
          },
          {
            path: "categories",
            element: <CategoryPage />,
          },
          {
            path: "attributes",
            element: <AttributePage />,
          },
          {
            path: "colors",
            element: <ColorPage />,
          },
        ],
      },
      {
        path: "invoice",
        children: [
          {
            path: "all",
            element: <AllInvoicePage />,
          },
          {
            path: "add",
            element: <CreateInvoicePage />,
          },
        ],
      },
      {
        path: "inventory",
        children: [
          {
            path: "all",
            element: <AllInventoryPage />,
          },
          // {
          //     path: "add",
          //     element: <CreateInventoryPage />,
          // },
        ],
      },
      {
        path: "order",
        children: [
          {
            path: "all",
            element: <OrderPage />,
          },
          {
            path: "add",
            element: <CreateOrderPage />,
          },
        ],
      },
      {
        path: "service",
        children: [
          {
            path: "add",
            element: <CreateServicePage />,
          },
        ],
      },
      {
        path: "billing",
        children: [
          {
            path: "add",
            element: <CreateBillingPage />,
          },
        ],
      },
      {
        path: "customers",
        element: <CustomerPage />,
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
