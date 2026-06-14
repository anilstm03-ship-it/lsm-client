'use client';
import { useState } from 'react';
import { Table, Button, Input, Space, Card, Modal, Form, message, InputNumber, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import PageHeader from '@/components/common/PageHeader';
import StatusTag from '@/components/common/StatusTag';
import ImageUpload from '@/components/common/ImageUpload';
import { useList } from '@/hooks/useApi';
import api from '@/lib/api';

const { Search } = Input;
const { TextArea } = Input;

export default function CategoriesPage() {
  const { data, pagination, loading, reload } = useList('/admin/categories');
  const [deleteId, setDeleteId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      if (editing) {
        await api.put(`/admin/categories/${editing.id}`, values);
        message.success('Category updated');
      } else {
        await api.post('/admin/categories', values);
        message.success('Category created');
      }
      setModalOpen(false);
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
      await api.delete(`/admin/categories/${deleteId}`);
      message.success('Category deleted');
      setDeleteId(null);
      reload();
    } catch (err) {
      message.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    { title: 'Image', dataIndex: 'image', key: 'image', width: 70, render: (img) => (
      img ? <img src={img} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} /> : '-'
    )},
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Slug', dataIndex: 'slug', key: 'slug' },
    { title: 'Courses', dataIndex: 'course_count', key: 'course_count', align: 'center' },
    { title: 'Sort Order', dataIndex: 'sort_order', key: 'sort_order', align: 'center' },
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
        title="Categories"
        subtitle={`${pagination.total} categories total`}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            New Category
          </Button>
        }
      />

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Search categories..."
            allowClear
            style={{ maxWidth: 280 }}
            onSearch={(v) => reload({ search: v, page: 1 })}
          />
        </div>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 700 }}
          pagination={{
            total: pagination.total,
            pageSize: pagination.limit,
            current: pagination.page,
            showSizeChanger: true,
            showTotal: (t) => `Total ${t} categories`,
            onChange: (page, limit) => reload({ page, limit }),
          }}
        />
      </Card>

      <Modal
        title={editing ? 'Edit Category' : 'New Category'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
        okText="Save"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input placeholder="e.g. Web Development" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="image" label="Image">
            <ImageUpload type="thumbnails" />
          </Form.Item>
          <Form.Item name="sort_order" label="Sort Order">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="active">
            <Select options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Delete Category"
        open={!!deleteId}
        onOk={handleDelete}
        onCancel={() => setDeleteId(null)}
        okButtonProps={{ danger: true }}
        okText="Delete"
      >
        Are you sure you want to delete this category? This action cannot be undone.
      </Modal>
    </div>
  );
}
