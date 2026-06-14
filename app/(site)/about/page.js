import StatsStrip from "@/components/site/StatsStrip";
import { SITE_LEGAL_NAME, SITE_NAME } from "@/config/siteConfig";

const values = [
  {
    icon: "bi-lightbulb-fill",
    title: "Quality Education",
    desc: "We partner with industry experts to design curriculum that's practical, current, and career-focused.",
  },
  {
    icon: "bi-people-fill",
    title: "Student-Centric",
    desc: "Every course, feature and support channel is built around helping students achieve their goals.",
  },
  {
    icon: "bi-rocket-takeoff-fill",
    title: "Continuous Growth",
    desc: "We constantly update our content to keep pace with the latest tools and industry trends.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <section className="hero-section">
        <div className="container py-5 text-center">
          <h1 className="font-heading mb-2">About Vidyaan</h1>
          <p className="text-white-50 mb-0">
            Empowering learners worldwide with quality online education
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <img
                src="https://placehold.co/600x420/2563eb/ffffff?text=About+Vidyaan"
                alt="About Vidyaan"
                className="img-fluid rounded-custom shadow-sm"
              />
            </div>
            <div className="col-lg-6">
              <span className="section-title-sm">Our Story</span>
              <h2 className="font-heading mt-2 mb-3">
                Building Skills That Shape Careers
              </h2>
              <p className="text-muted">
                {SITE_LEGAL_NAME} was founded with a simple mission: make
                high-quality, industry-relevant education accessible to
                everyone, everywhere. What started as a small initiative has
                grown into a thriving learning community of thousands of
                students and expert instructors.
              </p>
              <p className="text-muted">
                At {SITE_NAME}, we believe learning should be practical,
                engaging and flexible. Our courses in Web Development, Data
                Science, and Design are crafted by professionals who bring
                real-world experience into every lesson &mdash; helping you
                build a portfolio of skills that employers value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-light-custom">
        <div className="container">
          <StatsStrip />
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-title-sm">What Drives Us</span>
            <h2 className="font-heading mt-2">Our Core Values</h2>
          </div>
          <div className="row g-4">
            {values.map((v) => (
              <div className="col-md-4" key={v.title}>
                <div className="card card-custom border-0 h-100 p-4 text-center">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-custom bg-opacity-10 mx-auto mb-3"
                    style={{ width: 64, height: 64 }}
                  >
                    <i className={`bi ${v.icon} fs-3 text-primary-custom`}></i>
                  </div>
                  <h5 className="font-heading">{v.title}</h5>
                  <p className="text-muted small mb-0">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
