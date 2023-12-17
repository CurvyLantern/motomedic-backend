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
import { MdPayment } from "react-icons/md";
const getNavUrl = (prefix: string, url: string) => {
  return `/${prefix}/${url}`;
};

export const navData = [
  {
    label: "Home",
    icon: TbHome,
    href: "/",
  },
  {
    label: "POS",
    icon: MdPayment,
    href: "/pos",
  },
  {
    label: "Service Center",
    icon: MdPayment,
    href: "/service",
  },
  {
    label: "Service Management",
    icon: TbSettingsAutomation,
    childLinks: [
      {
        href: getNavUrl("service", "packages"),
        label: "Add Services",
        icon: TbShoppingBag,
      },
    ],
  },
  {
    label: "Product Management",
    icon: TbShoppingBag,
    childLinks: [
      {
        href: getNavUrl("product", "add"),
        label: "Add Product",
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
        href: getNavUrl("product", "models"),
        label: "Models",
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
        href: getNavUrl("order", "new"),
        label: "New orders",
        icon: TbShoppingBag,
      },
      {
        href: getNavUrl("order", "all"),
        label: "All orders",
        icon: TbShoppingBag,
      },
      // {
      //   href: getNavUrl("order", "process"),
      //   label: "Process Order",
      //   icon: TbShoppingBag,
      // },
    ],
  },

  {
    label: "Inventory Management",
    icon: TbCardboards,
    childLinks: [
      {
        href: getNavUrl("inventory", "all"),
        label: "All Inventory",
        icon: TbCardboards,
      },
      {
        href: getNavUrl("inventory", "add"),
        label: "Add to Inventory",
        icon: TbCardboards,
      },
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

  // {
  //   label: "Billing Management",
  //   icon: TbUser,
  //   childLinks: [
  //     {
  //       href: getNavUrl("billing", "add"),
  //       label: "Create Customer Invoice",
  //       icon: TbCardboards,
  //     },
  //     {
  //       href: getNavUrl("billing", "all"),
  //       label: "Customer Invoices",
  //       icon: TbCardboards,
  //     },
  //   ],
  // },
  {
    label: "Vendor Management",
    icon: TbUser,
    childLinks: [
      {
        label: "Vendors",
        href: "/vendors",
        icon: TbUser,
      },
    ],
  },
  {
    label: "Customers Management",
    icon: TbUser,
    href: "/customers",
  },
];
