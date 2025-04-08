import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hotel-contabilidad-35ebeef89ac8.herokuapp.com',

  //baseURL: 'http://localhost:8080',
});

export default api;
