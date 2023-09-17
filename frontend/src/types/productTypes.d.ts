type Product = {
  id: number | string;
  discount_type: "fixed" | "prcnt";
  size: string;
  compatibility: string;
  condition: string;
  weight: number | string;
  primary_img: string;
  product_name: string;
  short_descriptions: string;
  discount: string | number;
  price: string | number;
};
type Brand = {
  id: string;
  brandName: string;
  description: string;
  img: string | null;
};
