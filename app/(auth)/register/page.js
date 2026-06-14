"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Form, Input, Button, Alert } from "antd";
import useAuthStore from "@/store/authStore";

export default function RegisterPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const register = useAuthStore((s) => s.register);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onFinish = async (values) => {
    setErrorMsg("");
    setLoading(true);
    try {
      await register({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      router.push(searchParams.get("redirect") || "/");
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      const message = apiErrors?.length
        ? apiErrors.map((e) => e.message).join(", ")
        : err.response?.data?.message || "Registration failed. Please try again.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h3 className="font-heading text-center mb-1">Create Your Account</h3>
      <p className="text-muted text-center mb-4">Join Vidyaan and start learning today</p>

      {errorMsg && <Alert type="error" message={errorMsg} className="mb-3" showIcon closable onClose={() => setErrorMsg("")} />}

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item label="Full Name" name="name" rules={[{ required: true, message: "Please enter your name" }]}>
          <Input size="large" placeholder="Your full name" prefix={<i className="bi bi-person text-muted me-1"></i>} />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}>
          <Input size="large" placeholder="you@example.com" prefix={<i className="bi bi-envelope text-muted me-1"></i>} />
        </Form.Item>
        <Form.Item label="Phone" name="phone" rules={[{ required: true, message: "Please enter your phone number" }]}>
          <Input size="large" placeholder="Your phone number" prefix={<i className="bi bi-phone text-muted me-1"></i>} />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, min: 6, message: "Minimum 6 characters" }]}>
          <Input.Password size="large" placeholder="••••••••" prefix={<i className="bi bi-lock text-muted me-1"></i>} />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password size="large" placeholder="••••••••" prefix={<i className="bi bi-lock text-muted me-1"></i>} />
        </Form.Item>
        <Button type="primary" htmlType="submit" size="large" block loading={loading} className="btn-primary border-0 rounded-pill">
          Register
        </Button>
      </Form>

      <p className="text-center text-muted mt-4 mb-0">
        Already have an account?{" "}
        <Link
          href={searchParams.get("redirect") ? `/login?redirect=${encodeURIComponent(searchParams.get("redirect"))}` : "/login"}
          className="text-primary-custom fw-medium"
        >
          Login
        </Link>
      </p>
    </>
  );
}
