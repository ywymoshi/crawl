const axios =require('axios');
const qs =require('qs');
const {headers} =require('./config');
axios.defaults.withCredentials = true;
axios.interceptors.request.use(config => {
  config.headers = headers;
  return config;
}, err => {
  return Promise.reject(err)
})
axios.interceptors.response.use(response => response, err => Promise.resolve(err.response))


class Axios {
}
Axios.timeout = 3000;

Axios.get = (url, params)=>{
  if (!url) return
  return axios({
    method: 'get',
    url,
    params,
    timeout: 3000
  })
}
Axios.post = (url, data, type)=>{
  if (!url) return
  return axios({
    method: 'post',
    url,
    data: type ? data : qs.stringify(data),
    timeout: 3000
  })
}
Axios.put = (url, data)=>{
  if (!url) return
  return axios({
    method: 'put',
    url,
    data: data,
    timeout: 3000
  })
}
Axios.patch = (url, data)=>{
  if (!url) return
  return axios({
    method: 'patch',
    url,
    data: data,
    timeout: 3000
  })
}
Axios.delete = (url, data)=>{
  if (!url) return
  return axios({
    method: 'delete',
    url,
    data: data,
    timeout: 3000
  })
}
module.exports =  Axios;
