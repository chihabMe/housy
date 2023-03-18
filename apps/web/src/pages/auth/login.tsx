import Link from "next/link";
import React, { ChangeEvent, FormEvent, useState } from "react";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const formSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    console.log(data);
  };
  return (
    <div>
      <form action="" onSubmit={formSubmitHandler}>
        <input type="email" name="email" onChange={handleInputChange} />
        <input type="password" name="password" onChange={handleInputChange} />
        <button>login</button>
        <div>
          <Link href={"/auth/register"}>register</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
