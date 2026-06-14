'use client';
import { useState } from 'react';
import { Table, Input, Select, Card, Avatar, Drawer, Spin, Empty, List, Tag } from 'antd';
import { UserOutlined, BookOutlined } from '@ant-design/icons';
import PageHeader from '@/components/common/PageHeader';
import StatusTag from '@/components/common/StatusTag';
import { useList, useItem } from '@/hooks/useApi';

const { Search } = Input;

export default function StudentsPage() {
  const { data, pagination, loading, reload } = useList('/admin/students');
  const [viewId, setViewId] = useState(null);
  const { data: student, loading: studentLoading } = useItem('/admin/students', viewId);

  const columns = [
    { title: 'Photo', dataIndex: 'avatar', key: 'avatar', width: 60, render: (img) => (
      <Avatar src={img} icon={<UserOutlined />} />
    )},
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone', render: (v) => v || '-' },
    { title: 'Enrolled Courses', dataIndex: 'enrolled_count', key: 'enrolled_count', align: 'center' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <StatusTag status={s} /> },
    { title: 'Registered On', dataIndex: 'created_at', key: 'created_at', render: (v) => new Date(v).toLocaleDateString() },
  ];

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle={`${pagination.total} registered students`}
      />

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
          <Search
            placeholder="Search students..."
            allowClear
            style={{ maxWidth: 280 }}
            onSearch={(v) => reload({ search: v, page: 1 })}
          />
          <Select
            placeholder="Status"
            allowClear
            style={{ width: 140 }}
            options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]}
            onChange={(v) => reload({ status: v, page: 1 })}
          />
        </div>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 900 }}
          onRow={(record) => ({
            onClick: () => setViewId(record.id),
            style: { cursor: 'pointer' },
          })}
          pagination={{
            total: pagination.total,
            pageSize: pagination.limit,
            current: pagination.page,
            showSizeChanger: true,
            showTotal: (t) => `Total ${t} students`,
            onChange: (page, limit) => reload({ page, limit }),
          }}
        />
      </Card>

      <Drawer
        title="Student Enrollments"
        open={!!viewId}
        onClose={() => setViewId(null)}
        width={420}
      >
        {studentLoading ? (
          <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
        ) : student ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <Avatar size={48} src={student.avatar} icon={<UserOutlined />} />
              <div>
                <div style={{ fontWeight: 600 }}>{student.name}</div>
                <div style={{ color: '#8c8c8c', fontSize: 13 }}>{student.email}</div>
              </div>
            </div>

            <h6 style={{ marginBottom: 12 }}>
              <BookOutlined /> Enrolled Courses ({student.enrollments?.length || 0})
            </h6>
            {student.enrollments?.length ? (
              <List
                itemLayout="horizontal"
                dataSource={student.enrollments}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar shape="square" src={item.thumbnail} icon={<BookOutlined />} />}
                      title={item.course_name}
                      description={
                        <div>
                          <Tag color={item.status === 'completed' ? 'green' : item.status === 'expired' ? 'default' : 'blue'}>
                            {item.status}
                          </Tag>
                          <span style={{ fontSize: 12, color: '#8c8c8c' }}>
                            Progress: {item.progress_percent}% &middot; Enrolled {new Date(item.enrolled_at).toLocaleDateString()}
                          </span>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No course enrollments yet" />
            )}
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}
