import Link from "next/link";
import React, { ChangeEvent, FormEvent, useState } from "react";

const RegistrationPage = () => {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    rePassword: "",
  });
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const formSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/auth/register", {
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
        <input
          placeholder="email"
          type="email"
          name="email"
          onChange={handleInputChange}
        />
        <input
          placeholder="username"
          type="text"
          name="username"
          onChange={handleInputChange}
        />
        <input
          placeholder="password"
          type="password"
          name="password"
          onChange={handleInputChange}
        />
        <input
          placeholder="re password"
          type="password"
          name="rePassword"
          onChange={handleInputChange}
        />
        <button>register</button>
        <div>
          <Link href={"/auth/login"}>login</Link>
        </div>
      </form>
    </div>
  );
};

export default RegistrationPage;
