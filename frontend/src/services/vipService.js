import api from './api';

export const sendVipRequest = (data) => {
  return api.post('/vip', data);
};