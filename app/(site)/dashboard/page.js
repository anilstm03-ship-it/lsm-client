"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Spin, Progress, Tag } from "antd";
import api from "@/lib/api";

const PLACEHOLDER = "https://placehold.co/600x400/2563eb/ffffff?text=Vidyaan";

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/enrollments/my")
      .then((res) => setEnrollments(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-heading mb-4">My Courses</h4>

      {enrollments.length === 0 ? (
        <div className="card card-custom border-0 p-4 text-center text-muted">
          You haven&apos;t enrolled in any courses yet.{" "}
          <Link href="/courses" className="text-primary-custom fw-medium">
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {enrollments.map((e) => (
            <div className="col-md-6" key={e.id}>
              <div className="card card-custom border-0 h-100">
                <img
                  src={e.thumbnail || PLACEHOLDER}
                  alt={e.course_name}
                  style={{ height: 160, width: "100%", objectFit: "cover" }}
                />
                <div className="p-3">
                  <h6 className="font-heading mb-2">{e.course_name}</h6>
                  <Tag color={e.status === "completed" ? "green" : e.status === "expired" ? "default" : "blue"} className="mb-2 text-capitalize">
                    {e.status}
                  </Tag>
                  <Progress percent={Number(e.progress_percent)} size="small" />
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="text-muted small">
                      Enrolled {new Date(e.enrolled_at).toLocaleDateString()}
                    </span>
                    <Link href={`/courses/${e.slug}`} className="text-primary-custom fw-medium small">
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
