import Link from "next/link";
import HeroIllustration from "@/components/site/HeroIllustration";

export default function HeroBanner() {
  return (
    <section className="hero-section">
      <div className="container py-5">
        <div className="row align-items-center gy-5 py-4">
          <div className="col-lg-6">
            <span className="badge bg-white text-primary-custom rounded-pill px-3 py-2 mb-3 fw-medium">
              #1 Online Learning Platform
            </span>
            <h1 className="font-heading display-5 fw-bold mb-3">
              Learn New Skills &amp; Advance Your Career with Vidyaan
            </h1>
            <p className="lead text-white-50 mb-4">
              Join thousands of learners exploring expert-led courses in web
              development, data science, and design &mdash; anytime, anywhere.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link href="/courses" className="btn btn-accent btn-lg rounded-pill px-4">
                Explore Courses
              </Link>
              <Link href="/register" className="btn btn-outline-light btn-lg rounded-pill px-4">
                Join for Free
              </Link>
            </div>
            <div className="d-flex gap-4 mt-5">
              <div>
                <h4 className="font-heading mb-0">25,000+</h4>
                <p className="text-white-50 small mb-0">Active Students</p>
              </div>
              <div>
                <h4 className="font-heading mb-0">120+</h4>
                <p className="text-white-50 small mb-0">Online Courses</p>
              </div>
              <div>
                <h4 className="font-heading mb-0">40+</h4>
                <p className="text-white-50 small mb-0">Expert Teachers</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
