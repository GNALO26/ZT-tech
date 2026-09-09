import api from './api';

export const subscribeNewsletter = (email) => {
  return api.post('/subscribers/subscribe', { email });
};

export const unsubscribeNewsletter = (email) => {
  return api.post('/subscribers/unsubscribe', { email });
};