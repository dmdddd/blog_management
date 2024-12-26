import './App.css';
import { BrowserRouter as Router, Route, Routes, useParams, useLocation } from 'react-router-dom';
import BlogsListPage from './pages/BlogsListPage';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ArticlesListPage from './pages/ArticlesListPage';
import ArticlePage from './pages/ArticlePage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import CreateAccuntPage from './pages/CreateAccountPage';
import UpdateUserProfilePage from './pages/UpdateProfilePage';
import AddArticlePage from './pages/AddArticlePage';
import { BlogProviderWithParams } from './context/BlogProviderWithParams';
import DynamicPage from './pages/DynamicPage';
import CreateBlogPage from './pages/CreateBlogPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* General Routes */}
        <Route
          path="/"
          element={<Layout />} // No BlogProvider for general pages
        >
          <Route index element={<BlogsListPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/update-profile" element={<UpdateUserProfilePage />} />
          <Route path="/create-account" element={<CreateAccuntPage />} />
          <Route path="/create-blog" element={<CreateBlogPage />} />
        </Route>

        {/* Blog-Specific Routes */}
        <Route
          path="/blogs/:blogId/*"
          element={
            <BlogProviderWithParams>
              <Layout /> {/* Wrapped with BlogProvider for blog-specific routes */}
            </BlogProviderWithParams>
          }
        >
          {/* Predefined pages */}
          <Route path="articles" element={<ArticlesListPage />} />
          <Route path="articles/add" element={<AddArticlePage />} />
          <Route path="articles/:articleId" element={<ArticlePage />} />

          {/* Dynamic pages */}
          <Route path="pages/:dynamicPageSlug" element={<DynamicPage />} />
        </Route>

        {/* User-Related Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/update-profile" element={<UpdateUserProfilePage />} />

        {/* Catch-All for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

// function App() {
//   return (
//     <BrowserRouter>
//       <BlogProvider>
//         <div className="App">
//           <Routes>
//             <Route path="/" element={<Layout />}>
//               <Route index element={<BlogsListPage />} />
//             {/* <Route path="/" element={<HomePage />} /> */}
//               <Route path="/about" element={<AboutPage />} />
//               <Route path="/blogs/:blogId/articles" element={<ArticlesListPage />} />
//               <Route path="/blogs/:blogId/articles/add" element={<AddArticlePage />} />
//               <Route path="/blogs/:blogId/articles/:articleId" element={<ArticlePage />} />
//               <Route path="/login" element={<LoginPage />} />
//               <Route path="/create-account" element={<CreateAccuntPage />} />
//               <Route path="/update-profile" element={<UpdateUserProfilePage />} />
//               <Route path="*" element={<NotFoundPage />} />
//             </Route>
//           </Routes>
//         </div>
//       </BlogProvider>
//     </BrowserRouter>
//   );
// }

export default App;
