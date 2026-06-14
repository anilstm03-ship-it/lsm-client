'use client';
import { useState } from 'react';
import { Table, Button, Input, Space, Card, Drawer, Form, message, InputNumber, Select, Avatar, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import PageHeader from '@/components/common/PageHeader';
import StatusTag from '@/components/common/StatusTag';
import ImageUpload from '@/components/common/ImageUpload';
import { useList } from '@/hooks/useApi';
import api from '@/lib/api';

const { Search } = Input;
const { TextArea } = Input;

export default function TeachersPage() {
  const { data, pagination, loading, reload } = useList('/admin/teachers');
  const [deleteId, setDeleteId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      if (editing) {
        delete values.email;
        delete values.password;
        await api.put(`/admin/teachers/${editing.id}`, values);
        message.success('Teacher updated');
      } else {
        await api.post('/admin/teachers', values);
        message.success('Teacher created');
      }
      setDrawerOpen(false);
      reload();
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/teachers/${deleteId}`);
      message.success('Teacher deactivated');
      setDeleteId(null);
      reload();
    } catch (err) {
      message.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    { title: 'Photo', dataIndex: 'photo', key: 'photo', width: 60, render: (img) => (
      <Avatar src={img} icon={<UserOutlined />} />
    )},
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Designation', dataIndex: 'designation', key: 'designation', render: (v) => v || '-' },
    { title: 'Specialization', dataIndex: 'specialization', key: 'specialization', render: (v) => v || '-' },
    { title: 'Courses', dataIndex: 'course_count', key: 'course_count', align: 'center' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <StatusTag status={s} /> },
    { title: 'Actions', key: 'actions', width: 100, render: (_, r) => (
      <Space>
        <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(r)} />
        <Button icon={<DeleteOutlined />} size="small" danger onClick={() => setDeleteId(r.id)} />
      </Space>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Teachers"
        subtitle={`${pagination.total} teachers total`}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            New Teacher
          </Button>
        }
      />

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
          <Search
            placeholder="Search teachers..."
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
          scroll={{ x: 1000 }}
          pagination={{
            total: pagination.total,
            pageSize: pagination.limit,
            current: pagination.page,
            showSizeChanger: true,
            showTotal: (t) => `Total ${t} teachers`,
            onChange: (page, limit) => reload({ page, limit }),
          }}
        />
      </Card>

      <Drawer
        title={editing ? 'Edit Teacher' : 'New Teacher'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={480}
        extra={
          <Button type="primary" loading={saving} onClick={handleSave}>
            Save
          </Button>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item name="photo" label="Photo">
            <ImageUpload type="avatars" />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input placeholder="Full name" />
          </Form.Item>
          {!editing && (
            <>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Valid email is required' }]}>
                <Input placeholder="teacher@vidyaan.com" />
              </Form.Item>
              <Form.Item name="password" label="Password" rules={[{ required: true, min: 6, message: 'Min 6 characters' }]}>
                <Input.Password placeholder="Password" />
              </Form.Item>
            </>
          )}
          <Form.Item name="phone" label="Phone">
            <Input placeholder="Phone number" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="designation" label="Designation">
                <Input placeholder="e.g. Senior Instructor" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="experience_years" label="Experience (years)">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="specialization" label="Specialization">
            <Input placeholder="e.g. Web Development" />
          </Form.Item>
          <Form.Item name="qualification" label="Qualification">
            <Input placeholder="e.g. M.Tech, Computer Science" />
          </Form.Item>
          <Form.Item name="bio" label="Bio">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="active">
            <Select options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        title="Deactivate Teacher"
        open={!!deleteId}
        onOk={handleDelete}
        onCancel={() => setDeleteId(null)}
        okButtonProps={{ danger: true }}
        okText="Deactivate"
      >
        Are you sure you want to deactivate this teacher? Their account will be disabled.
      </Modal>
    </div>
  );
}
