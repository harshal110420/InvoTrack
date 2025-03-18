import React from "react";
import { useState } from "react";

const loginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };
  return (
    <form onSubmit={handleSubmit} className="p-4 shadow">
      <div>Login page</div>
    </form>
  );
};

export default loginForm;
