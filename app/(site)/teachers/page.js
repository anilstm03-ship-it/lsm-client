"use client";

import { useEffect, useState } from "react";
import { Spin } from "antd";
import TeacherCard from "@/components/site/TeacherCard";
import api from "@/lib/api";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/teachers")
      .then((res) => setTeachers(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="container py-5 text-center">
          <h1 className="font-heading mb-2">Meet Our Teachers</h1>
          <p className="text-white-50 mb-0">
            Learn from industry experts who are passionate about teaching
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          {loading ? (
            <div className="text-center"><Spin size="large" /></div>
          ) : teachers.length === 0 ? (
            <div className="text-center text-muted py-5">No teachers available yet.</div>
          ) : (
            <div className="row g-4">
              {teachers.map((teacher) => (
                <div className="col-md-6 col-lg-3" key={teacher.id}>
                  <TeacherCard teacher={teacher} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
