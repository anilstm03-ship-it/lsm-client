'use client';
import { Layout, Avatar, Dropdown, Typography, Space } from 'antd';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';

const { Header } = Layout;
const { Text } = Typography;

export default function AdminHeader({ onToggle }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const userMenuItems = [
    {
      key: 'site',
      label: 'View Site',
      onClick: () => router.push('/'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: 'Logout',
      danger: true,
      onClick: async () => {
        await logout();
        router.push('/login');
      },
    },
  ];

  return (
    <Header style={{
      background: '#fff',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 99,
    }}>
      <MenuOutlined
        style={{ fontSize: 18, cursor: 'pointer', color: '#595959' }}
        onClick={onToggle}
      />

      <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
        <Space style={{ cursor: 'pointer' }}>
          <Avatar icon={<UserOutlined />} style={{ background: '#2563EB' }} />
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{user?.name}</div>
            <Text type="secondary" style={{ fontSize: 11 }}>{user?.role}</Text>
          </div>
        </Space>
      </Dropdown>
    </Header>
  );
}
