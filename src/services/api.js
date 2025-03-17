import axios from 'axios';

const apiClientJson = axios.create({
  baseURL: 'https://localhost',
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiClientLdJson = axios.create({
  baseURL: 'https://localhost',
  headers: {
    'Content-Type': 'application/ld+json',
  },
});

const apiClientMerge = axios.create({
  baseURL: 'https://localhost',
  headers: {
    'Content-Type': 'application/merge-patch+json',
  },
});


export default {
  getContents() {
    return apiClientJson.get('/api/contents');
  },
  getContent(slug) {
    return apiClientJson.get(`/api/contents/${slug}`);
  },
  createContent(data) {
    return apiClientLdJson.post('/api/contents', data);
  },
  getComments() {
    return apiClientJson.get('/api/comments');
  },
  createComment(data) {
    return apiClientJson.post('/api/comments', data);
  },
  login(data) {
    return apiClientJson.post('/api/login', data);
  },
  register(data) {
    return apiClientLdJson.post('/api/users', data);
  },
  updateContent(slug, data) {
    return apiClientMerge.patch(`/api/contents/${slug}`, data);
  },
};
