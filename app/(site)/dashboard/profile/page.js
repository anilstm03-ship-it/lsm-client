"use client";

import { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({ name: user.name, email: user.email, phone: user.phone });
    }
  }, [user, profileForm]);

  const handleProfileSave = async (values) => {
    setSavingProfile(true);
    try {
      const { data } = await api.put("/auth/profile", { name: values.name, phone: values.phone });
      setUser(data.data);
      message.success("Profile updated successfully");
    } catch (err) {
      message.error(err.response?.data?.message || "Update failed");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (values) => {
    setSavingPassword(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success("Password changed successfully");
      passwordForm.resetFields();
    } catch (err) {
      message.error(err.response?.data?.message || "Password change failed");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div>
      <h4 className="font-heading mb-4">My Profile</h4>

      <div className="card card-custom border-0 p-4 mb-4">
        <h6 className="font-heading mb-3">Profile Details</h6>
        <Form layout="vertical" form={profileForm} onFinish={handleProfileSave}>
          <Form.Item label="Full Name" name="name" rules={[{ required: true, message: "Name is required" }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input size="large" disabled />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={savingProfile} className="rounded-pill px-4">
            Save Changes
          </Button>
        </Form>
      </div>

      <div className="card card-custom border-0 p-4">
        <h6 className="font-heading mb-3">Change Password</h6>
        <Form layout="vertical" form={passwordForm} onFinish={handlePasswordSave}>
          <Form.Item label="Current Password" name="currentPassword" rules={[{ required: true, message: "Current password is required" }]}>
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item label="New Password" name="newPassword" rules={[{ required: true, min: 6, message: "Minimum 6 characters" }]}>
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) return Promise.resolve();
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={savingPassword} className="rounded-pill px-4">
            Change Password
          </Button>
        </Form>
      </div>
    </div>
  );
}
