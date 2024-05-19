import { Product } from "@/types";

class ProductCache {
  private data: Product[] | null = null;

  getData(): Product[] | null {
    return this.data;
  }

  setData(data: Product[]): void {
    this.data = data;
  }
}

export const productCache = new ProductCache();
