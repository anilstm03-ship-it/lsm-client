'use client';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined, AppstoreOutlined, TeamOutlined, BookOutlined,
  LogoutOutlined, ReadOutlined, UserOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import useAuthStore from '@/store/authStore';

const { Sider } = Layout;

const menuItems = [
  { key: '/admin', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/admin/categories', icon: <AppstoreOutlined />, label: 'Categories' },
  { key: '/admin/teachers', icon: <TeamOutlined />, label: 'Teachers' },
  { key: '/admin/courses', icon: <BookOutlined />, label: 'Courses' },
  { key: '/admin/students', icon: <UserOutlined />, label: 'Students' },
];

export default function AdminSidebar({ collapsed, onCollapse }) {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);

  const segments = pathname.split('/');
  const activeKey = segments.length > 2 ? `/admin/${segments[2]}` : '/admin';

  const handleMenu = async ({ key }) => {
    if (key === '/logout') {
      await logout();
      router.push('/login');
    } else {
      router.push(key);
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={240}
      style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100 }}
    >
      <div style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        padding: collapsed ? 0 : '0 20px',
        color: '#fff',
        fontWeight: 700,
        fontSize: collapsed ? 18 : 16,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}>
        <ReadOutlined style={{ marginRight: collapsed ? 0 : 10, fontSize: 20 }} />
        {!collapsed && 'Vidyaan Admin'}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[activeKey]}
        items={menuItems}
        onClick={handleMenu}
        style={{ flex: 1, borderRight: 0 }}
      />

      <Menu
        theme="dark"
        mode="inline"
        selectable={false}
        items={[{ key: '/logout', icon: <LogoutOutlined />, label: 'Logout', danger: true }]}
        onClick={handleMenu}
        style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
      />
    </Sider>
  );
}
