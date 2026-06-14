'use client';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import CourseForm from '@/components/admin/CourseForm';
import api from '@/lib/api';

export default function CreateCoursePage() {
  const router = useRouter();

  const handleSubmit = async (values) => {
    await api.post('/admin/courses', values);
    message.success('Course created');
    router.push('/admin/courses');
  };

  return (
    <div>
      <PageHeader title="New Course" subtitle="Add a new course to the catalog" />
      <CourseForm onSubmit={handleSubmit} submitLabel="Create Course" />
    </div>
  );
}
