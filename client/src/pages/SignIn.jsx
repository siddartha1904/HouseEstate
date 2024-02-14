import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";
import OAuth from "../components/OAuth.jsx";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-[Impact] font-semibold my-7">
        Sign In
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 items-center"
      >
        <input
          type="email"
          placeholder="E-MAIL"
          className="border p-3 bg-neutral-200 w-[500px] rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="PASSWORD"
          className="border bg-neutral-200 w-[500px] p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-red-600 w-[140px] h-[46px] font-bold text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Log In"}
        </button>
      </form>
      <div className="flex gap-5 mt-5 text-justify absolute top-[410px] right-64">
        <p>Don't have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
      <hr class="h-px my-8 mt-15 bg-black border-0 border-width: 2px;"></hr>
      <p className="flex items-center justify-center">OR </p>
      <hr class="h-px my-8 mt-15 bg-black border-0 border-width: 2px; dark:bg-gray-700"></hr>
      <OAuth />
    </div>
  );
}
