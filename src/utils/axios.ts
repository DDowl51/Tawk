import axios from 'axios';

const server = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

server.interceptors.response.use(
  response => response,
  error =>
    Promise.reject(
      (error.response && error.response.data) ||
        error.message ||
        'Something went wrong.'
    )
);

export default server;
