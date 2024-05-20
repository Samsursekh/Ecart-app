"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "../types";
import { productCache } from "../cache";
import { useSearch } from "@/context/SearchProvider";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import HeroSlider from "./HeroSlider";

const AllProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { searchQuery } = useSearch();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    const cachedData = productCache.getData();
    if (cachedData) {
      setProducts(cachedData);
    } else {
      const fetchData = async (): Promise<void> => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_PRODUCT_API}`
          );
          const data: Product[] = await response.json();
          console.log(data, "Data is there or not ");
          setProducts(data);
          productCache.setData(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, []);

  const handleAddToCart = async (product: Product): Promise<void> => {
    if (!user) {
      router.push("/login");
      return;
    }
    await addToCart(product);
  };

  const goToSinglePage = (productId: string) => {
    router.push(`/singleProduct?productId=${productId}`);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <HeroSlider />
      <div className="flex justify-evenly mt-16">
        <div className="w-[25%] border-2 bg-sky-200  overflow-y-auto  left-2">
          Sidebar
        </div>
        <div className="w-[70%]">
          <div className="grid gap-5 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="py-6 border rounded-sm hover:border-blue-800 cursor-pointer"
                onClick={() => goToSinglePage(product.id)}
              >
                <Image
                  src={product.image1}
                  alt={product.name}
                  width={180}
                  height={200}
                  className="m-auto"
                />
                <h3 className="font-semibold ml-3">{product.name}</h3>
                <div className="flex ml-3 m-auto text-left space-x-4 mt-3">
                  <p className="font-bold">₹ {product.price}.00</p>
                  <del>
                    <p className=" text-gray-500 text-[13px]">
                      ₹ {product.mrp}.00
                    </p>
                  </del>
                  <span className="font-semibold text-[13px] bg-green-200 text-green-700 px-2 pt-[2px] rounded-md">
                    ₹ {product.discount} OFF
                  </span>
                </div>

                <div className="flex space-x-2">
                  <h3 className="text-gray-500 mt-2 ml-3">{product.brand}</h3>
                  <h3 className="text-gray-500 mt-2 ml-3">
                    {product.category}
                  </h3>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  className="border-2 px-5 py-2 mt-4 ml-3 border-blue-500 text-blue-500 font-bold"
                >
                  Add to cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProduct;
