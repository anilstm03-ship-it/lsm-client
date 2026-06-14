'use client';
import { Row, Col, Card, Statistic } from 'antd';
import {
  TeamOutlined, ReadOutlined, BookOutlined, AppstoreOutlined, FileDoneOutlined,
} from '@ant-design/icons';
import PageHeader from '@/components/common/PageHeader';
import { useItem } from '@/hooks/useApi';

export default function AdminDashboardPage() {
  const { data, loading } = useItem('/admin/dashboard', 'stats');

  const cards = [
    { title: 'Students', value: data?.students ?? 0, icon: <TeamOutlined />, color: '#2563EB' },
    { title: 'Teachers', value: data?.teachers ?? 0, icon: <ReadOutlined />, color: '#0EA5E9' },
    { title: 'Courses', value: data?.courses?.total ?? 0, suffix: `(${data?.courses?.published ?? 0} published)`, icon: <BookOutlined />, color: '#16A34A' },
    { title: 'Categories', value: data?.categories ?? 0, icon: <AppstoreOutlined />, color: '#F97316' },
    { title: 'Enrollments', value: data?.enrollments ?? 0, icon: <FileDoneOutlined />, color: '#9333EA' },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your platform" />

      <Row gutter={[16, 16]}>
        {cards.map((c) => (
          <Col xs={24} sm={12} md={8} lg={6} key={c.title}>
            <Card loading={loading}>
              <Statistic
                title={c.title}
                value={c.value}
                prefix={<span style={{ color: c.color, marginRight: 8 }}>{c.icon}</span>}
              />
              {c.suffix && <div style={{ color: '#8c8c8c', fontSize: 12, marginTop: 4 }}>{c.suffix}</div>}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
