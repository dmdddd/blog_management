import { Link, useNavigate } from 'react-router-dom';
import useUser from '../../hooks/useUser';
import { getAuth, signOut } from 'firebase/auth';

const BasicNavbar = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    return (
        <nav>
            <ul>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/">Blogs</Link></li>
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

export default BasicNavbar;