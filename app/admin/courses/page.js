'use client';
import { useState } from 'react';
import { Table, Button, Input, Select, Space, Card, Modal, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import StatusTag from '@/components/common/StatusTag';
import { useList } from '@/hooks/useApi';
import api from '@/lib/api';

const { Search } = Input;

export default function CoursesPage() {
  const router = useRouter();
  const { data, pagination, loading, reload } = useList('/admin/courses');
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/courses/${deleteId}`);
      message.success('Course deleted');
      setDeleteId(null);
      reload();
    } catch (err) {
      message.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    { title: 'Thumbnail', dataIndex: 'thumbnail', key: 'thumbnail', width: 80, render: (img) => (
      img ? <img src={img} alt="" style={{ width: 56, height: 36, objectFit: 'cover', borderRadius: 4 }} /> : '-'
    )},
    { title: 'Course Name', dataIndex: 'course_name', key: 'course_name' },
    { title: 'Category', dataIndex: 'category_name', key: 'category_name', render: (v) => v || '-' },
    { title: 'Teacher', dataIndex: 'teacher_name', key: 'teacher_name', render: (v) => v || '-' },
    { title: 'Price', key: 'price', render: (_, r) => (
      r.discount_price ? (
        <span><s style={{ color: '#bbb' }}>₹{r.price}</s> ₹{r.discount_price}</span>
      ) : <span>₹{r.price}</span>
    )},
    { title: 'Level', dataIndex: 'level', key: 'level', render: (l) => <Tag>{l}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <StatusTag status={s} /> },
    { title: 'Actions', key: 'actions', width: 120, render: (_, r) => (
      <Space>
        <Button icon={<EyeOutlined />} size="small" onClick={() => window.open(`/courses/${r.slug}`, '_blank')} />
        <Button icon={<EditOutlined />} size="small" onClick={() => router.push(`/admin/courses/${r.id}/edit`)} />
        <Button icon={<DeleteOutlined />} size="small" danger onClick={() => setDeleteId(r.id)} />
      </Space>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Courses"
        subtitle={`${pagination.total} courses total`}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/admin/courses/create')}>
            New Course
          </Button>
        }
      />

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
          <Search
            placeholder="Search courses..."
            allowClear
            style={{ maxWidth: 280 }}
            onSearch={(v) => reload({ search: v, page: 1 })}
          />
          <Select
            placeholder="Status"
            allowClear
            style={{ width: 140 }}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            onChange={(v) => reload({ status: v, page: 1 })}
          />
        </div>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            total: pagination.total,
            pageSize: pagination.limit,
            current: pagination.page,
            showSizeChanger: true,
            showTotal: (t) => `Total ${t} courses`,
            onChange: (page, limit) => reload({ page, limit }),
          }}
        />
      </Card>

      <Modal
        title="Delete Course"
        open={!!deleteId}
        onOk={handleDelete}
        onCancel={() => setDeleteId(null)}
        okButtonProps={{ danger: true }}
        okText="Delete"
      >
        Are you sure you want to delete this course? This action cannot be undone.
      </Modal>
    </div>
  );
}
