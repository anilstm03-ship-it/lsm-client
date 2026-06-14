import Link from "next/link";

const ICONS = {
  "web-development": "bi-code-slash",
  "data-science": "bi-bar-chart-line",
  design: "bi-palette",
};

export default function CategoryCard({ category }) {
  const icon = ICONS[category.slug] || "bi-mortarboard";
  return (
    <Link
      href={`/courses?category=${category.slug}`}
      className="card card-custom border-0 text-center text-decoration-none p-4 h-100"
    >
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-custom bg-opacity-10 mx-auto mb-3"
        style={{ width: 64, height: 64 }}
      >
        <i className={`bi ${icon} fs-3 text-primary-custom`}></i>
      </div>
      <h6 className="font-heading text-dark mb-1">{category.name}</h6>
      <p className="text-muted small mb-0">{category.course_count} Courses</p>
    </Link>
  );
}
