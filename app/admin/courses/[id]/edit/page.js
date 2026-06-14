'use client';
import { Card, message, Spin } from 'antd';
import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import CourseForm from '@/components/admin/CourseForm';
import CurriculumManager from '@/components/admin/CurriculumManager';
import { useItem } from '@/hooks/useApi';
import api from '@/lib/api';

export default function EditCoursePage() {
  const router = useRouter();
  const { id } = useParams();
  const { data, loading } = useItem('/admin/courses', id);

  const handleSubmit = async (values) => {
    await api.put(`/admin/courses/${id}`, values);
    message.success('Course updated');
    router.push('/admin/courses');
  };

  return (
    <div>
      <PageHeader title="Edit Course" subtitle="Update course details" />
      {loading || !data ? <Spin /> : (
        <>
          <CourseForm initialValues={data} onSubmit={handleSubmit} submitLabel="Save Changes" />
          <Card className="mt-4">
            <CurriculumManager courseId={id} />
          </Card>
        </>
      )}
    </div>
  );
}
