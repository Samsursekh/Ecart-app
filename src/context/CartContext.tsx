"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

interface CartContextProps {
  products: Product[];
  fetchData: () => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  addToCart: (product: Product) => Promise<void>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const notify = (message: string) => toast(message);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CART_API}`);
      const data = await response.json();

      const productsWithQuantity = data.map((product: Product) => ({
        ...product,
        quantity: product.quantity || 1,
      }));

      setProducts(productsWithQuantity);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  const removeFromCart = useCallback(async (productId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CART_API}/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
        notify("Product removed !");
      } else {
        console.error("Failed to remove product from cart");
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  }, []);

  const increaseQuantity = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  const decreaseQuantity = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
  };

  const addToCart = useCallback(async (product: Product) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CART_API}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        setProducts((prevProducts) => [
          ...prevProducts,
          { ...product, quantity: 1 },
        ]);
        notify("Product added to cart!");
        console.log("Product added to cart successfully");
      } else {
        notify("Already added to cart!");

        console.error("Failed to add product to cart");
        return;
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <CartContext.Provider
      value={{
        products,
        fetchData,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        addToCart,
      }}
    >
      {children}
      <ToastContainer />
    </CartContext.Provider>
  );
};
