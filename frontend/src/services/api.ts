import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


const api = axios.create({
  baseURL: API_BASE,
});

export interface Post {
  _id: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getPosts = async (): Promise<Post[]> => {
  const { data } = await api.get<ApiResponse<Post[]>>('/posts');
  return data.data;
};

export const createPost = async (formData: FormData): Promise<Post> => {
  const { data } = await api.post<ApiResponse<Post>>('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};

export default api;
