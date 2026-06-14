import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/config/siteConfig";

export default function AuthLayout({ children }) {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center hero-section py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="text-center mb-4">
              <Link href="/" className="d-inline-flex align-items-center gap-2 fs-3 fw-bold text-white font-heading">
                <span
                  className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white text-primary-custom"
                  style={{ width: 44, height: 44, fontSize: "1.2rem" }}
                >
                  V
                </span>
                {SITE_NAME}
              </Link>
              <p className="text-white-50 mt-1 mb-0">{SITE_TAGLINE}</p>
            </div>
            <div className="card card-custom border-0 p-4 p-md-5">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
