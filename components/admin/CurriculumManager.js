'use client';
import { useState, useEffect, useCallback } from 'react';
import { Collapse, Button, List, Modal, Form, Input, InputNumber, Select, Switch, Space, message, Empty, Spin, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '@/lib/api';

export default function CurriculumManager({ courseId }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [moduleModal, setModuleModal] = useState(null);
  const [lessonModal, setLessonModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [moduleForm] = Form.useForm();
  const [lessonForm] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/curriculum/courses/${courseId}`);
      setModules(res.data.data || []);
    } catch (err) {
      message.error('Failed to load curriculum');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => { load(); }, [load]);

  const openModuleCreate = () => {
    moduleForm.resetFields();
    setModuleModal({});
  };

  const openModuleEdit = (m) => {
    moduleForm.setFieldsValue(m);
    setModuleModal(m);
  };

  const handleModuleSave = async () => {
    try {
      const values = await moduleForm.validateFields();
      setSaving(true);
      if (moduleModal?.id) {
        await api.put(`/admin/curriculum/modules/${moduleModal.id}`, values);
        message.success('Module updated');
      } else {
        await api.post(`/admin/curriculum/courses/${courseId}/modules`, values);
        message.success('Module added');
      }
      setModuleModal(null);
      load();
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const openLessonCreate = (moduleId) => {
    lessonForm.resetFields();
    setLessonModal({ moduleId });
  };

  const openLessonEdit = (moduleId, lesson) => {
    lessonForm.setFieldsValue({ ...lesson, is_preview: !!lesson.is_preview });
    setLessonModal({ moduleId, lesson });
  };

  const handleLessonSave = async () => {
    try {
      const values = await lessonForm.validateFields();
      setSaving(true);
      if (lessonModal.lesson) {
        await api.put(`/admin/curriculum/lessons/${lessonModal.lesson.id}`, values);
        message.success('Lesson updated');
      } else {
        await api.post(`/admin/curriculum/courses/${courseId}/modules/${lessonModal.moduleId}/lessons`, values);
        message.success('Lesson added');
      }
      setLessonModal(null);
      load();
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteTarget.type === 'module') {
        await api.delete(`/admin/curriculum/modules/${deleteTarget.id}`);
        message.success('Module deleted');
      } else {
        await api.delete(`/admin/curriculum/lessons/${deleteTarget.id}`);
        message.success('Lesson deleted');
      }
      setDeleteTarget(null);
      load();
    } catch (err) {
      message.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spin />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Curriculum</h6>
        <Button icon={<PlusOutlined />} onClick={openModuleCreate}>Add Module</Button>
      </div>

      {modules.length === 0 ? (
        <Empty description="No modules yet" />
      ) : (
        <Collapse
          items={modules.map((m) => ({
            key: m.id,
            label: (
              <span>
                {m.title}
                {m.status === 'inactive' && <Tag color="default" className="ms-2">Inactive</Tag>}
              </span>
            ),
            extra: (
              <Space onClick={(e) => e.stopPropagation()}>
                <Button size="small" icon={<EditOutlined />} onClick={() => openModuleEdit(m)} />
                <Button size="small" danger icon={<DeleteOutlined />} onClick={() => setDeleteTarget({ type: 'module', id: m.id })} />
              </Space>
            ),
            children: (
              <>
                <List
                  dataSource={m.lessons}
                  locale={{ emptyText: 'No lessons yet' }}
                  renderItem={(l) => (
                    <List.Item
                      actions={[
                        <Button key="edit" size="small" icon={<EditOutlined />} onClick={() => openLessonEdit(m.id, l)} />,
                        <Button key="delete" size="small" danger icon={<DeleteOutlined />} onClick={() => setDeleteTarget({ type: 'lesson', id: l.id })} />,
                      ]}
                    >
                      <span>
                        {l.title}
                        {!!l.is_preview && <Tag color="blue" className="ms-2">Preview</Tag>}
                        {l.duration_minutes ? <span className="text-muted ms-2">{l.duration_minutes} min</span> : null}
                        {l.status === 'inactive' && <Tag color="default" className="ms-2">Inactive</Tag>}
                      </span>
                    </List.Item>
                  )}
                />
                <Button type="dashed" size="small" icon={<PlusOutlined />} className="mt-2" onClick={() => openLessonCreate(m.id)}>
                  Add Lesson
                </Button>
              </>
            ),
          }))}
        />
      )}

      <Modal
        title={moduleModal?.id ? 'Edit Module' : 'Add Module'}
        open={!!moduleModal}
        onOk={handleModuleSave}
        onCancel={() => setModuleModal(null)}
        confirmLoading={saving}
        okText="Save"
      >
        <Form form={moduleForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
            <Input placeholder="e.g. Getting Started" />
          </Form.Item>
          {moduleModal?.id && (
            <Form.Item name="status" label="Status">
              <Select options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
            </Form.Item>
          )}
        </Form>
      </Modal>

      <Modal
        title={lessonModal?.lesson ? 'Edit Lesson' : 'Add Lesson'}
        open={!!lessonModal}
        onOk={handleLessonSave}
        onCancel={() => setLessonModal(null)}
        confirmLoading={saving}
        okText="Save"
      >
        <Form form={lessonForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
            <Input placeholder="e.g. Course Introduction" />
          </Form.Item>
          <Form.Item name="video_type" label="Video Type">
            <Select allowClear options={[
              { value: 'youtube', label: 'YouTube' },
              { value: 'vimeo', label: 'Vimeo' },
              { value: 'upload', label: 'Uploaded File' },
            ]} />
          </Form.Item>
          <Form.Item name="video_url" label="Video URL">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="duration_minutes" label="Duration (minutes)">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="is_preview" label="Free Preview" valuePropName="checked">
            <Switch />
          </Form.Item>
          {lessonModal?.lesson && (
            <Form.Item name="status" label="Status">
              <Select options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
            </Form.Item>
          )}
        </Form>
      </Modal>

      <Modal
        title="Confirm Delete"
        open={!!deleteTarget}
        onOk={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        okButtonProps={{ danger: true }}
        okText="Delete"
      >
        Are you sure you want to delete this {deleteTarget?.type}? This action cannot be undone.
      </Modal>
    </div>
  );
}
