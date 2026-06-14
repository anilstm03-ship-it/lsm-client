"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CourseCard from "@/components/site/CourseCard";
import api from "@/lib/api";

const levels = ["beginner", "intermediate", "advanced"];

function CoursesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [level, setLevel] = useState("all");
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 9, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page: 1, limit: 9 };
    if (search) params.search = search;
    if (category !== "all") params.category = category;
    if (level !== "all") params.level = level;

    const timer = setTimeout(() => {
      api.get("/courses", { params })
        .then((res) => {
          setCourses(res.data.data || []);
          if (res.data.pagination) setPagination(res.data.pagination);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category, level]);

  const loadPage = (page) => {
    setLoading(true);
    const params = { page, limit: pagination.limit };
    if (search) params.search = search;
    if (category !== "all") params.category = category;
    if (level !== "all") params.level = level;
    api.get("/courses", { params })
      .then((res) => {
        setCourses(res.data.data || []);
        if (res.data.pagination) setPagination(res.data.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  return (
    <>
      {/* Page Header */}
      <section className="hero-section">
        <div className="container py-5 text-center">
          <h1 className="font-heading mb-2">Explore Our Courses</h1>
          <p className="text-white-50 mb-0">
            Find the right course to build the skills you need
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row g-4">
            {/* Sidebar Filters */}
            <div className="col-lg-3">
              <div className="card card-custom border-0 p-4 mb-4">
                <h6 className="font-heading mb-3">Search</h6>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search courses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="card card-custom border-0 p-4 mb-4">
                <h6 className="font-heading mb-3">Category</h6>
                <div className="d-flex flex-column gap-2">
                  <label className="form-check d-flex align-items-center gap-2">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="category"
                      checked={category === "all"}
                      onChange={() => setCategory("all")}
                    />
                    <span className="form-check-label">All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label className="form-check d-flex align-items-center gap-2" key={cat.id}>
                      <input
                        type="radio"
                        className="form-check-input"
                        name="category"
                        checked={category === cat.slug}
                        onChange={() => setCategory(cat.slug)}
                      />
                      <span className="form-check-label">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="card card-custom border-0 p-4 mb-4">
                <h6 className="font-heading mb-3">Level</h6>
                <div className="d-flex flex-column gap-2">
                  <label className="form-check d-flex align-items-center gap-2">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="level"
                      checked={level === "all"}
                      onChange={() => setLevel("all")}
                    />
                    <span className="form-check-label">All Levels</span>
                  </label>
                  {levels.map((lvl) => (
                    <label className="form-check d-flex align-items-center gap-2 text-capitalize" key={lvl}>
                      <input
                        type="radio"
                        className="form-check-input"
                        name="level"
                        checked={level === lvl}
                        onChange={() => setLevel(lvl)}
                      />
                      <span className="form-check-label">{lvl}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Course Grid */}
            <div className="col-lg-9">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <p className="text-muted mb-0">{pagination.total} courses found</p>
              </div>
              {!loading && courses.length === 0 ? (
                <div className="text-center text-muted py-5">
                  No courses match your filters.
                </div>
              ) : (
                <div className="row g-4">
                  {courses.map((course) => (
                    <div className="col-md-6 col-xl-4" key={course.id}>
                      <CourseCard course={course} />
                    </div>
                  ))}
                </div>
              )}

              {pagination.totalPages > 1 && (
                <nav className="mt-5 d-flex justify-content-center">
                  <ul className="pagination">
                    <li className={`page-item ${pagination.page <= 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => loadPage(pagination.page - 1)}>
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: pagination.totalPages }).map((_, i) => (
                      <li className={`page-item ${pagination.page === i + 1 ? "active" : ""}`} key={i}>
                        <button className="page-link" onClick={() => loadPage(i + 1)}>{i + 1}</button>
                      </li>
                    ))}
                    <li className={`page-item ${pagination.page >= pagination.totalPages ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => loadPage(pagination.page + 1)}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={null}>
      <CoursesContent />
    </Suspense>
  );
}
