import {
  TbShoppingBag,
  TbSettingsAutomation,
  TbHammer,
  TbUser,
  TbCash,
  TbUserDollar,
  TbHome,
  TbCardboards,
} from "react-icons/tb";

const getNavUrl = (prefix: string, url: string) => {
  return `${prefix}/${url}`;
};

export const navData = [
  {
    label: "Home",
    icon: TbHome,
    href: "/",
  },
  {
    label: "Products",
    icon: TbShoppingBag,
    childLinks: [
      {
        href: getNavUrl("product", "add"),
        label: "Add New Product",
        icon: TbShoppingBag,
      },

      {
        href: getNavUrl("product", "all"),
        label: "All Products",
        icon: TbShoppingBag,
      },
      {
        href: getNavUrl("product", "categories"),
        label: "Categories",
        icon: TbShoppingBag,
      },
      {
        href: getNavUrl("product", "brands"),
        label: "Brand",
        icon: TbShoppingBag,
      },
      {
        href: getNavUrl("product", "attributes"),
        label: "Attributes",
        icon: TbShoppingBag,
      },
      {
        href: getNavUrl("product", "colors"),
        label: "Colors",
        icon: TbShoppingBag,
      },
    ],
  },
  {
    label: "Sales",
    icon: TbCash,
    childLinks: [
      {
        href: getNavUrl("order", "all"),
        label: "All orders",
        icon: TbShoppingBag,
      },
      {
        href: getNavUrl("order", "add"),
        label: "Create Order",
        icon: TbShoppingBag,
      },
    ],
  },
  {
    label: "Invoice Management",
    icon: TbCardboards,
    childLinks: [
      {
        href: getNavUrl("invoice", "add"),
        label: "Create Invoice",
        icon: TbCardboards,
      },
      {
        href: getNavUrl("invoice", "all"),
        label: "All Invoices",
        icon: TbCardboards,
      },
      // {
      //     href: "service/create-service-data",
      //     label: "Create Service Essentitals",
      //     icon: TbSettingsAutomation,
      // },
    ],
  },
  {
    label: "Service Management",
    icon: TbSettingsAutomation,
    childLinks: [
      {
        href: getNavUrl("service", "add"),
        label: "Create Service",
        icon: TbSettingsAutomation,
      },
      {
        href: getNavUrl("service", "all"),
        label: "All Services",
        icon: TbSettingsAutomation,
      },
      // {
      //     href: "service/create-service-data",
      //     label: "Create Service Essentitals",
      //     icon: TbSettingsAutomation,
      // },
    ],
  },
  {
    label: "Mechanic Management",
    icon: TbHammer,
    childLinks: [
      {
        href: getNavUrl("mechanic", "all"),
        label: "All Mechanics",
        icon: TbSettingsAutomation,
      },
    ],
  },
  {
    label: "Customers",
    icon: TbUser,
    childLinks: [
      {
        href: getNavUrl("customer", "all"),
        label: "All Customers",
        icon: TbUserDollar,
      },
    ],
  },
];
