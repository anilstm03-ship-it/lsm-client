'use client';
import { useState } from 'react';
import { Upload, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import api from '@/lib/api';

export default function ImageUpload({ value, onChange, type = 'thumbnails' }) {
  const [loading, setLoading] = useState(false);

  const customRequest = async ({ file, onSuccess, onError }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post(`/upload/image?type=${type}`, formData, {
        headers: { 'Content-Type': undefined },
      });
      onChange?.(data.data.url);
      onSuccess(data);
    } catch (err) {
      message.error(err.response?.data?.message || 'Upload failed');
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Upload
      listType="picture-card"
      showUploadList={false}
      customRequest={customRequest}
      accept="image/png,image/jpeg,image/jpg,image/webp"
    >
      {value ? (
        <img src={value} alt="upload" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      )}
    </Upload>
  );
}
