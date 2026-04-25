import api from './config';

// ── Auth ──────────────────────────────────────────────
export const loginApi    = (dto)        => api.post('/users/login', dto);
export const registerApi = (dto)        => api.post('/users/register', dto);
export const getProfile  = ()           => api.get('/users/profile');
export const updateProfile = (fd)       => api.put('/users/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
export const changePassword = (pass)    => api.patch(`/users/password?pass=${encodeURIComponent(pass)}`);

// ── Blogs ─────────────────────────────────────────────
export const getAllBlogs  = ()          => api.get('/blogs');
export const getMyBlogs  = ()          => api.get('/blogs/private');
export const getBlogById = (id, userId) => api.get(`/blogs/${id}${userId ? `?userId=${userId}` : ''}`);
export const createBlog  = (fd)        => api.post('/blogs', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateBlog  = (id, fd)    => api.put(`/blogs/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteBlog  = (id)        => api.delete(`/blogs/${id}`);

// ── Likes ─────────────────────────────────────────────
export const likeBlog    = (blogId, userId)   => api.post(`/api/blogs/${blogId}/like?userId=${userId}`);
export const unlikeBlog  = (blogId, userId)   => api.delete(`/api/blogs/${blogId}/like?userId=${userId}`);
export const getLikeCount= (blogId)           => api.get(`/api/blogs/${blogId}/likes/count`);

// ── Feed ──────────────────────────────────────────────
export const getFeed     = ()          => api.get('/api/feed');

// ── Follow ────────────────────────────────────────────
export const followUser         = (id) => api.post(`/api/users/${id}/follow`);
export const unfollowUser       = (id) => api.delete(`/api/users/${id}/follow`);
export const getFollowersCount  = (id) => api.get(`/api/users/${id}/followers/count`);
export const getFollowingCount  = (id) => api.get(`/api/users/${id}/following/count`);

// ── Feedback ──────────────────────────────────────────
export const createFeedback    = (blogId, rating, comment) =>
  api.post(`/feedback?blogId=${blogId}&rating=${rating}&comment=${encodeURIComponent(comment)}`);
export const getFeedbackByBlog = (blogId)     => api.get(`/feedback/blog/${blogId}`);
export const getFeedbackByUser = (userId)     => api.get(`/feedback/user/${userId}`);
export const updateFeedback    = (id, rating, comment) =>
  api.put(`/feedback/${id}?rating=${rating}&comment=${encodeURIComponent(comment)}`);
export const deleteFeedback    = (id)         => api.delete(`/feedback/${id}`);
export const getAvgRating      = (blogId)     => api.get(`/feedback/blog/${blogId}/average-rating`);
