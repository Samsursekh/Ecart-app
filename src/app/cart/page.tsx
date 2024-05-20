"use client";

import { useCart } from "@/context/CartContext";
import { useSearch } from "@/context/SearchProvider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface Product {
  id: string;
  name: string;
  image1: string;
  price: number;
  brand: string;
  mrp: number;
  discount: number;
  category: string;
  quantity: number;
}

function CartPage(): JSX.Element {
  const {
    products,
    fetchData,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const router = useRouter();
  const { searchQuery } = useSearch();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const calculateTotal = (): number => {
    return products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const goToSinglePage = (productId: string) => {
    router.push(`/singleProduct?productId=${productId}`);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex justify-evenly  pt-[100px]">
      <div className="w-[25%] border-2 bg-sky-200">
        <div className=" font-bold text-xl py-4 px-2 bg-slate-100 h-[100px]">
          Cart Total: ₹ {calculateTotal()}.00
        </div>
      </div>
      <div className="w-[70%]">
        <div className="grid gap-5 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
          {filteredProducts?.map((prod) => (
            <div
              key={prod.id}
              className="py-6 border rounded-sm hover:border-blue-800 cursor-pointer"
            >
              <Image
                src={prod.image1}
                alt={prod.name}
                width={180}
                height={200}
                className="m-auto"
                onClick={() => goToSinglePage(prod.id)}
              />
              <h3 className="font-semibold ml-3 text-xl">{prod.name}</h3>
              <div className="flex ml-3 m-auto text-left space-x-4 mt-3">
                <p className="font-bold">₹ {prod.price}.00</p>
                <del>
                  <p className=" text-gray-500 text-[13px]">₹ {prod.mrp}.00</p>
                </del>
                <span className="font-semibold text-[13px] bg-green-200 text-green-700 px-2 pt-[2px] rounded-md">
                  ₹ {prod.discount} OFF
                </span>
              </div>

              <div className="flex space-x-2">
                <h3 className="text-gray-500 mt-2 ml-3">{prod.brand}</h3>
                <h3 className="text-gray-500 mt-2 ml-3">{prod.category}</h3>
              </div>

              <div className="flex items-center mt-4 ml-3 space-x-2">
                <button
                  onClick={() => decreaseQuantity(prod.id)}
                  className="border-2 px-2 py-1 border-blue-500 text-blue-500 font-bold"
                >
                  -
                </button>
                <span>{prod.quantity}</span>
                <button
                  onClick={() => increaseQuantity(prod.id)}
                  className="border-2 px-2 py-1 border-blue-500 text-blue-500 font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(prod.id)}
                className="border-2 px-5 py-2 mt-4 ml-3 border-blue-500 text-blue-500 font-bold"
              >
                Remove from cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CartPage;
