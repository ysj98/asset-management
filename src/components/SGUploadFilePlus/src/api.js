import axios from 'axios';

// 多图片上传
export function uploadMultipartImage(formData) {
  return axios.post('/uhomecp-app/common/multipartFileUpload.json', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

// 多文件上传
export function uploadMultipartFile(formData) {
  return axios.post('/uhomecp-app/common/uploadMultipartFile.json', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
