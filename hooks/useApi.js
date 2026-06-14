import { useState, useEffect, useRef, useCallback } from 'react';
import api from '@/lib/api';
import { message } from 'antd';

export function useList(endpoint, initialParams = {}) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20 });
  const [loading, setLoading] = useState(false);
  const paramsRef = useRef(initialParams);
  const [tick, setTick] = useState(0);

  const doFetch = useCallback(async (p) => {
    setLoading(true);
    try {
      const res = await api.get(endpoint, { params: p });
      setData(res.data.data || []);
      if (res.data.pagination) setPagination(res.data.pagination);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    doFetch(paramsRef.current);
  }, [tick, doFetch]);

  // reload() re-fetches with current params
  // reload({ key: val }) merges overrides then re-fetches
  const reload = useCallback((overrides) => {
    if (overrides) {
      paramsRef.current = { ...paramsRef.current, ...overrides };
    }
    setTick((t) => t + 1);
  }, []);

  return { data, pagination, loading, reload };
}

export function useItem(endpoint, id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.get(`${endpoint}/${id}`);
      setData(res.data.data);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [endpoint, id]);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, reload: fetch };
}
