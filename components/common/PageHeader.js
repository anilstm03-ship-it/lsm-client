import { Typography, Breadcrumb } from 'antd';

const { Title } = Typography;

export default function PageHeader({ title, subtitle, extra, breadcrumbs }) {
  return (
    <div className="d-flex align-items-start justify-content-between" style={{ marginBottom: 24 }}>
      <div>
        {breadcrumbs && (
          <Breadcrumb
            items={breadcrumbs}
            style={{ marginBottom: 6, fontSize: 12 }}
          />
        )}
        <Title level={4} style={{ margin: 0 }}>{title}</Title>
        {subtitle && <p style={{ color: '#8c8c8c', marginTop: 4, fontSize: 13 }}>{subtitle}</p>}
      </div>
      <div>{extra}</div>
    </div>
  );
}
