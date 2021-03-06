import { ProductList_products_edges_node as products_edges_node } from "@saleor/sdk/lib/queries/gqlTypes/ProductList";
import { ProductDetails_product_variants } from "@temp/views/Product/gqlTypes/ProductDetails";

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface ProductList_products_edges_node extends products_edges_node {
  variants?: (ProductDetails_product_variants | null)[] | null;
  isAvailableForPurchase?: boolean | null;
}

export type IProduct = WithOptional<
  ProductList_products_edges_node,
  "slug" | "seoTitle" | "seoDescription"
>;
