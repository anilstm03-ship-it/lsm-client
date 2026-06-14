import { Tag } from 'antd';

const statusConfig = {
  active: { color: 'green', label: 'Active' },
  inactive: { color: 'default', label: 'Inactive' },
  draft: { color: 'orange', label: 'Draft' },
  published: { color: 'green', label: 'Published' },
};

export default function StatusTag({ status }) {
  const cfg = statusConfig[status] || { color: 'default', label: status };
  return <Tag color={cfg.color}>{cfg.label}</Tag>;
}
