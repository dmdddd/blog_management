// import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { useBlog } from '../context/BlogContext'; // Assuming BlogContext is in the parent folder

// /**
//  * Custom hook to retrieve blog data.
//  * Checks if blog data exists in context, or if passed via location state.
//  * If not, fetches the blog from the backend.
//  */
// const useBlogData = (blogId) => {
//   const location = useLocation();
//   const { blog, fetchBlog, setBlogFromState } = useBlog(); // Access blog data from context

//   useEffect(() => {
//     if (!blog && location.state && location.state.blogId) {
//       // If blog data is passed via location.state, set it in context
//       setBlogFromState(location.state.blogId);
//     } else if (!blog) {
//       // If blog is not available in context, fetch it from backend
//       console.log("No context, fetch from BE")
//       fetchBlog(blogId);
//     }
//   }, [blog, location.state, blogId, setBlogFromState, fetchBlog]);

//   return blog; // Return the blog from context
// };

// export default useBlogData;