export default function HeroIllustration() {
  return (
    <div className="position-relative mx-auto" style={{ maxWidth: 480 }}>
      <div
        className="bg-white rounded-custom shadow-lg d-flex align-items-center justify-content-center position-relative overflow-hidden"
        style={{ height: 380 }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(37,99,235,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(249,115,22,0.12) 0%, transparent 55%)",
          }}
        ></div>

        <div className="text-center position-relative">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-custom bg-opacity-10 mb-3"
            style={{ width: 140, height: 140 }}
          >
            <i className="bi bi-mortarboard-fill text-primary-custom" style={{ fontSize: "4.5rem" }}></i>
          </div>
          <h5 className="font-heading text-dark mb-1">Learn Without Limits</h5>
          <p className="text-muted small mb-0 px-4">
            Video lectures, notes &amp; quizzes &mdash; all in one place
          </p>
        </div>
      </div>

      {/* Floating badge: Certified */}
      <div
        className="card card-custom border-0 shadow-sm position-absolute d-none d-sm-flex flex-row align-items-center gap-2 px-3 py-2"
        style={{ top: -20, right: -20 }}
      >
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10"
          style={{ width: 40, height: 40 }}
        >
          <i className="bi bi-patch-check-fill text-success fs-5"></i>
        </div>
        <div>
          <p className="mb-0 small fw-semibold text-dark">Certified</p>
          <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>120+ Courses</p>
        </div>
      </div>

      {/* Floating badge: Video Lessons */}
      <div
        className="card card-custom border-0 shadow-sm position-absolute d-none d-sm-flex flex-row align-items-center gap-2 px-3 py-2"
        style={{ bottom: 30, left: -30 }}
      >
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-custom bg-opacity-10"
          style={{ width: 40, height: 40 }}
        >
          <i className="bi bi-play-circle-fill text-primary-custom fs-5"></i>
        </div>
        <div>
          <p className="mb-0 small fw-semibold text-dark">Video Lessons</p>
          <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>Learn anytime</p>
        </div>
      </div>

      {/* Floating badge: Rating */}
      <div
        className="card card-custom border-0 shadow-sm position-absolute d-none d-sm-flex flex-row align-items-center gap-2 px-3 py-2"
        style={{ bottom: -24, right: 20 }}
      >
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-warning bg-opacity-25"
          style={{ width: 40, height: 40 }}
        >
          <i className="bi bi-star-fill text-warning fs-5"></i>
        </div>
        <div>
          <p className="mb-0 small fw-semibold text-dark">4.9 / 5 Rating</p>
          <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>25,000+ Students</p>
        </div>
      </div>
    </div>
  );
}
