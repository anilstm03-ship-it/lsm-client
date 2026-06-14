import Link from "next/link";

const PLACEHOLDER = "https://placehold.co/300x300/2563eb/ffffff?text=Vidyaan";

export default function TeacherCard({ teacher }) {
  const social = teacher.social_links || {};
  return (
    <div className="card card-custom h-100 border-0 text-center">
      <img
        src={teacher.photo || PLACEHOLDER}
        alt={teacher.name}
        className="w-100"
        style={{ height: 220, objectFit: "cover" }}
      />
      <div className="card-body">
        <h6 className="font-heading mb-1">
          <Link href={`/teachers/${teacher.id}`} className="text-dark">
            {teacher.name}
          </Link>
        </h6>
        {teacher.designation && (
          <p className="text-primary-custom small fw-medium mb-2">
            {teacher.designation}
          </p>
        )}
        {teacher.specialization && (
          <p className="text-muted small mb-3">
            {teacher.specialization}
          </p>
        )}
        <div className="d-flex justify-content-center gap-2">
          {social.linkedin && (
            <a href={social.linkedin} className="btn btn-sm btn-outline-primary rounded-circle">
              <i className="bi bi-linkedin"></i>
            </a>
          )}
          {social.twitter && (
            <a href={social.twitter} className="btn btn-sm btn-outline-primary rounded-circle">
              <i className="bi bi-twitter-x"></i>
            </a>
          )}
          <Link href={`/teachers/${teacher.id}`} className="btn btn-sm btn-primary rounded-pill px-3">
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
