import { stats } from "@/lib/mockData";

export default function StatsStrip({ variant = "light" }) {
  const isDark = variant === "dark";
  return (
    <div className={`row text-center g-4 ${isDark ? "text-white" : ""}`}>
      {stats.map((stat) => (
        <div className="col-6 col-md-3" key={stat.id}>
          <div
            className={`d-inline-flex align-items-center justify-content-center rounded-circle mb-3 ${
              isDark ? "bg-white bg-opacity-10" : "bg-primary-custom bg-opacity-10"
            }`}
            style={{ width: 64, height: 64 }}
          >
            <i className={`bi ${stat.icon} fs-3 ${isDark ? "text-white" : "text-primary-custom"}`}></i>
          </div>
          <h3 className="font-heading mb-0">{stat.value}</h3>
          <p className={`mb-0 small ${isDark ? "text-white-50" : "text-muted"}`}>{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
