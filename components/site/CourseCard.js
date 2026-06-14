import Link from "next/link";

const levelColors = {
  beginner: "success",
  intermediate: "warning",
  advanced: "danger",
};

const PLACEHOLDER = "https://placehold.co/600x400/2563eb/ffffff?text=Vidyaan";

export default function CourseCard({ course }) {
  const hasDiscount =
    course.discount_price && Number(course.discount_price) < Number(course.price);

  return (
    <div className="card card-custom h-100 border-0">
      <Link href={`/courses/${course.slug}`}>
        <img
          src={course.thumbnail || PLACEHOLDER}
          alt={course.course_name}
          className="w-100"
          style={{ height: 180, objectFit: "cover" }}
        />
      </Link>
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className={`badge badge-level text-bg-${levelColors[course.level] || "secondary"} text-capitalize`}>
            {course.level}
          </span>
          {course.category_name && (
            <span className="small text-muted">{course.category_name}</span>
          )}
        </div>
        <h6 className="font-heading mb-2">
          <Link href={`/courses/${course.slug}`} className="text-dark">
            {course.course_name}
          </Link>
        </h6>
        <p className="text-muted small mb-3 flex-grow-1">
          {course.short_description}
        </p>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="small text-muted">
            <i className="bi bi-person-circle me-1"></i>
            {course.teacher_name || "Vidyaan Faculty"}
          </span>
          {course.duration && (
            <span className="small text-muted">
              <i className="bi bi-clock me-1"></i>
              {course.duration}
            </span>
          )}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {hasDiscount ? (
              <>
                <span className="fw-bold fs-5 text-primary-custom me-2">
                  ₹{course.discount_price}
                </span>
                <span className="text-muted text-decoration-line-through small">
                  ₹{course.price}
                </span>
              </>
            ) : (
              <span className="fw-bold fs-5 text-primary-custom">
                ₹{course.price}
              </span>
            )}
          </div>
          <Link href={`/courses/${course.slug}`} className="btn btn-sm btn-outline-primary rounded-pill">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
