import api from './api';

export const getFormations = (category = 'all') => {
  return api.get('/formations', { params: { category } });
};

export const getFormationBySlug = (slug) => {
  return api.get(`/formations/${slug}`);
};

// Admin
export const createFormation = (data) => {
  return api.post('/admin/formations', data);
};

export const updateFormation = (id, data) => {
  return api.put(`/admin/formations/${id}`, data);
};

export const deleteFormation = (id) => {
  return api.delete(`/admin/formations/${id}`);
};