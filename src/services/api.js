import axios from 'axios';

const token = localStorage.getItem('token');

const apiClientJson = axios.create({
  baseURL: 'https://localhost',
  headers: {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `${token}` }),
  },
});

const apiClientLdJson = axios.create({
  baseURL: 'https://localhost',
  headers: {
    'Content-Type': 'application/ld+json',
    ...(token && { 'Authorization': `${token}` }),
  },
});

const apiClientMerge = axios.create({
  baseURL: 'https://localhost',
  headers: {
    'Content-Type': 'application/merge-patch+json',
    ...(token && { 'Authorization': `${token}` }),
  },
});


export default {
  getContents() {
    return apiClientLdJson.get('/api/contents');
  },
  getContent(slug) {
    return apiClientJson.get(`/api/contents/${slug}`);
  },
  createContent(data) {
    return apiClientLdJson.post('/api/contents', data);
  },
  getComment(data) {
    return apiClientLdJson.get( `${data}`);
  },
  createComment(data) {
    return apiClientLdJson.post('/api/comments', data);
  },
  login(data) {
    return apiClientLdJson.post('/api/login', data);
  },
  register(data) {
    return apiClientLdJson.post('/api/users', data);
  },
  updateContent(slug, data) {
    return apiClientMerge.patch(`/api/contents/${slug}`, data);
  },
  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    return apiClientLdJson.post('/api/uploads', formData);
  },
  getUser(uuid) {
    return apiClientJson.get(`${uuid}`);
  },
  getUsers() {
    return apiClientLdJson.get('/api/users');
  },
};
