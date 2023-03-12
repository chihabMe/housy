import { response } from "express";
import React, { ChangeEvent, FormEvent, useState } from "react";

const initialState = {
  email: "",
  password: "",
};
const LoginPage = () => {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleFormSubmission = async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/v1/auth/token/obtain", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!data.success) setFormError(data.errors.form);
    else setMessage(data.message);
  };
  return (
    <div>
      <form action="" onSubmit={handleFormSubmission}>
        <div>
          <input
            onChange={handleInputChange}
            type="email"
            placeholder="email"
            name="email"
          />
        </div>
        <div>
          <input
            onChange={handleInputChange}
            type="password"
            placeholder="password"
            name="password"
          />
        </div>
        <div>{message ?? formError}</div>
        <button>login</button>
      </form>
    </div>
  );
};

export default LoginPage;
