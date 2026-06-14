"use client";

import { Form, Input, Button } from "antd";
import { CONTACT } from "@/config/siteConfig";

const contactInfo = [
  {
    icon: "bi-geo-alt-fill",
    title: "Address",
    value: CONTACT.address,
  },
  {
    icon: "bi-telephone-fill",
    title: "Phone",
    value: CONTACT.phone,
  },
  {
    icon: "bi-envelope-fill",
    title: "Email",
    value: CONTACT.email,
  },
];

export default function ContactPage() {
  const [form] = Form.useForm();

  const onFinish = () => {
    // Submission will be wired up once the backend API is ready
  };

  return (
    <>
      <section className="hero-section">
        <div className="container py-5 text-center">
          <h1 className="font-heading mb-2">Contact Us</h1>
          <p className="text-white-50 mb-0">
            We&apos;d love to hear from you. Reach out with any questions.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row g-4 mb-5">
            {contactInfo.map((info) => (
              <div className="col-md-4" key={info.title}>
                <div className="card card-custom border-0 p-4 text-center h-100">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-custom bg-opacity-10 mx-auto mb-3"
                    style={{ width: 64, height: 64 }}
                  >
                    <i className={`bi ${info.icon} fs-3 text-primary-custom`}></i>
                  </div>
                  <h6 className="font-heading">{info.title}</h6>
                  <p className="text-muted small mb-0">{info.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card card-custom border-0 p-4 h-100">
                <h5 className="font-heading mb-4">Send us a message</h5>
                <Form layout="vertical" form={form} onFinish={onFinish}>
                  <Form.Item label="Full Name" name="name" rules={[{ required: true, message: "Please enter your name" }]}>
                    <Input size="large" placeholder="Your name" />
                  </Form.Item>
                  <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}>
                    <Input size="large" placeholder="you@example.com" />
                  </Form.Item>
                  <Form.Item label="Phone" name="phone">
                    <Input size="large" placeholder="Your phone number" />
                  </Form.Item>
                  <Form.Item label="Subject" name="subject">
                    <Input size="large" placeholder="Subject" />
                  </Form.Item>
                  <Form.Item label="Message" name="message" rules={[{ required: true, message: "Please enter your message" }]}>
                    <Input.TextArea rows={4} placeholder="Write your message..." />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" size="large" block className="btn-primary border-0">
                    Send Message
                  </Button>
                </Form>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card card-custom border-0 overflow-hidden h-100" style={{ minHeight: 400 }}>
                <img
                  src="https://placehold.co/600x500/0f172a/ffffff?text=Map+Location"
                  alt="Vidyaan location map"
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
