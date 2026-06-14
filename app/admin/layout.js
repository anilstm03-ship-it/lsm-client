'use client';
import { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import useAuthStore from '@/store/authStore';

const { Content } = Layout;

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, loading, fetchProfile } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('vidyaan_access_token')) {
      router.push('/login');
      return;
    }
    if (!user) fetchProfile();
  }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/login');
  }, [loading, user]);

  if (loading || !user || user.role !== 'admin') return null;

  const sideWidth = collapsed ? 80 : 240;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AdminSidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout style={{ marginLeft: sideWidth, transition: 'margin-left 0.2s' }}>
        <AdminHeader onToggle={() => setCollapsed((c) => !c)} />
        <Content style={{ padding: 24, background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
