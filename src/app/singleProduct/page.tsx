"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { productCache } from "@/cache";
import { Product } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Suspense } from "react";

const ProductDetails: React.FC<{ productId: string | null }> = ({
  productId,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (productId) {
      const cachedData = productCache.getData();
      if (cachedData) {
        const foundProduct = cachedData.find((prod) => prod.id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
          return;
        }
      }

      const fetchProduct = async (): Promise<void> => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_PRODUCT_API}/${productId}`
          );
          const data: Product = await response.json();
          setProduct(data);
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      };

      fetchProduct();
    }
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = async (product: Product): Promise<void> => {
    if (!user) {
      router.push("/login");
      return;
    }

    await addToCart(product);
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-[100px]">
      <div className="flex flex-col space-x-5 lg:flex-row border-2 w-full md:w-[80%] lg:w-full m-auto p-5">
        <div className=" w-full px-5">
          <div>
            <Image
              src={product.image1}
              alt={product.name}
              width={500}
              height={500}
              className=" w-full"
            />
          </div>
          <div className="flex justify-between w-full">
            <Image
              src={product.image2}
              alt={product.name}
              width={90}
              height={90}
              className=" w-full"
            />
            <Image
              src={product.image3}
              alt={product.name}
              width={90}
              height={90}
              className=" w-full"
            />
            <Image
              src={product.image1}
              alt={product.name}
              width={90}
              height={90}
              className=" w-full"
            />
          </div>
        </div>
        <div className="lg:ml-8 mt-4 lg:mt-0">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center mt-4">
            <p className="text-2xl font-bold">₹ {product.price}.00</p>
            <del className="ml-4 text-gray-500">₹ {product.mrp}.00</del>
            <span className="ml-4 text-green-700 bg-green-200 px-2 rounded">
              ₹ {product.discount} OFF
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-600">{product.brand}</h3>
            <h3 className="text-gray-600">{product.category}</h3>
            <p className="text-gray-600">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est,
              tempore necessitatibus, magni iste aut veniam nemo illum,
              reprehenderit mollitia ullam alias? Ducimus eligendi recusandae
              incidunt. Corporis facere cumque voluptatibus dignissimos amet
              eveniet atque nemo, ex soluta temporibus fuga? Pariatur nesciunt
              ullam magnam debitis ea aliquid qui quas voluptas, consequuntur
              hic veniam accusantium perspiciatis asperiores atque temporibus
              quibusdam omnis! Temporibus, aliquam.
            </p>
          </div>
          <button
            onClick={() => handleAddToCart(product)}
            className="mt-6 px-4 py-2 bg-blue-500 text-white font-bold rounded"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductSearch: React.FC = () => {
  const searchParams = useSearchParams();
  const productId = searchParams ? searchParams.get("productId") : null;
  return <ProductDetails productId={productId} />;
};

const SingleProduct: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductSearch />
    </Suspense>
  );
};

export default SingleProduct;
