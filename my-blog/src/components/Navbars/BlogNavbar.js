import { Link, useNavigate, useParams } from 'react-router-dom';
import useUser from '../../hooks/useUser';
import { getAuth, signOut } from 'firebase/auth';
import { useBlog } from '../../context/BlogContext';  // Access blog context


const BlogNavbar = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { currentBlog, blogPages, loading, error } = useBlog();

    return (
        <nav>
            <ul>
                {/* <li><Link to={`/blogs/${currentBlog?.name}/home`}>Home</Link></li>
                <li><Link to={`/blogs/${currentBlog?.name}/about`}>About</Link></li> */}
                <li key="articles"><Link to={`/blogs/${currentBlog?.name}/articles`}>Articles</Link></li>
                {blogPages.map((page) => (
                    <li key={page.slug}>
                        <Link to={`/blogs/${currentBlog?.name}/pages/${page.slug}`}>{page.title}</Link>
                    </li>
                ))}
            </ul>
            <div className="nav-right">
                {user &&
                    <button onClick={() => {
                        navigate('/update-profile');
                    }}>Profile</button>}
                {user 
                    ? <button onClick={() => {
                        signOut(getAuth());
                    }}>Log Out</button>
                    : <button onClick={() => {
                        navigate('/login');
                    }}>Log In</button>}
            </div>
        </nav>
    )
}

export default BlogNavbar;