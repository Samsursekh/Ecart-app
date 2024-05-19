"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const { username, email, password } = credentials;
    login(username, email, password);
    router.push("/");
  };

  return (
    <div className=" flex justify-center items-center h-screen">
      <form
        onSubmit={handleLogin}
        className="p-4 border rounded-md shadow-md w-[80%] md:w-[40%] lg:w-[27%]"
      >
        <h2 className="text-2xl mb-4">Login</h2>
        <input
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleInputChange}
          placeholder="Enter your username"
          className="border p-2 rounded-md w-full mb-4"
        />
        <input
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          className="border p-2 rounded-md w-full mb-4"
        />
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          className="border p-2 rounded-md w-full mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Login
        </button>
      </form>
    </div>
  );
}
