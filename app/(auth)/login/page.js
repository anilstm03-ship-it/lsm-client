"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Form, Input, Button, Checkbox, Alert } from "antd";
import useAuthStore from "@/store/authStore";

export default function LoginPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onFinish = async (values) => {
    setErrorMsg("");
    setLoading(true);
    try {
      await login({ email: values.email, password: values.password });
      router.push(searchParams.get("redirect") || "/");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h3 className="font-heading text-center mb-1">Welcome Back</h3>
      <p className="text-muted text-center mb-4">Login to continue to your dashboard</p>

      {errorMsg && <Alert type="error" message={errorMsg} className="mb-3" showIcon closable onClose={() => setErrorMsg("")} />}

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}>
          <Input size="large" placeholder="you@example.com" prefix={<i className="bi bi-envelope text-muted me-1"></i>} />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password" }]}>
          <Input.Password size="large" placeholder="••••••••" prefix={<i className="bi bi-lock text-muted me-1"></i>} />
        </Form.Item>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Link href="#" className="small text-primary-custom">Forgot password?</Link>
        </div>
        <Button type="primary" htmlType="submit" size="large" block loading={loading} className="btn-primary border-0 rounded-pill">
          Login
        </Button>
      </Form>

      <p className="text-center text-muted mt-4 mb-0">
        Don&apos;t have an account?{" "}
        <Link
          href={searchParams.get("redirect") ? `/register?redirect=${encodeURIComponent(searchParams.get("redirect"))}` : "/register"}
          className="text-primary-custom fw-medium"
        >
          Register
        </Link>
      </p>
    </>
  );
}
