'use client';
import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Select, Row, Col, Card, Button, message } from 'antd';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/common/ImageUpload';
import api from '@/lib/api';

const { TextArea } = Input;

export default function CourseForm({ initialValues, onSubmit, submitLabel }) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/categories', { params: { limit: 100 } })
      .then((res) => setCategories(res.data.data || []))
      .catch(() => {});
    api.get('/admin/teachers', { params: { limit: 100, status: 'active' } })
      .then((res) => setTeachers(res.data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        learning_points: Array.isArray(initialValues.learning_points)
          ? initialValues.learning_points.join('\n')
          : '',
      });
    }
  }, [initialValues, form]);

  const handleFinish = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const learning_points = (values.learning_points || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      await onSubmit({ ...values, learning_points });
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <Form form={form} layout="vertical" initialValues={{ level: 'beginner', status: 'draft' }}>
        <Row gutter={16}>
          <Col xs={24} md={16}>
            <Form.Item name="course_name" label="Course Name" rules={[{ required: true, message: 'Course name is required' }]}>
              <Input placeholder="e.g. Complete Web Development Bootcamp" />
            </Form.Item>
            <Form.Item name="short_description" label="Short Description">
              <TextArea rows={2} placeholder="One-line summary shown on course cards" />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <TextArea rows={8} placeholder="Full course description" />
            </Form.Item>
            <Form.Item
              name="learning_points"
              label="What you'll learn"
              extra="One point per line — shown as a checklist on the course details page"
            >
              <TextArea rows={5} placeholder={'e.g.\nCore concepts and best practices\nHands-on project experience'} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="thumbnail" label="Thumbnail">
              <ImageUpload type="thumbnails" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="category_id" label="Category" rules={[{ required: true, message: 'Category is required' }]}>
              <Select
                placeholder="Select category"
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="teacher_id" label="Teacher">
              <Select
                placeholder="Select teacher"
                allowClear
                options={teachers.map((t) => ({ value: t.id, label: t.name }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={6}>
            <Form.Item name="price" label="Price (₹)" rules={[{ required: true, message: 'Price is required' }]}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item name="discount_price" label="Discount Price (₹)">
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item name="duration" label="Duration">
              <Input placeholder="e.g. 40 hours" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item name="level" label="Level">
              <Select options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="status" label="Status">
          <Select options={[
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
            { value: 'inactive', label: 'Inactive' },
          ]} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" loading={saving} onClick={handleFinish}>
            {submitLabel}
          </Button>
          <Button style={{ marginLeft: 12 }} onClick={() => router.push('/admin/courses')}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
