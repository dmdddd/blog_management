import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, updateProfile  } from 'firebase/auth';
import useUser from "../hooks/useUser";


const UpdateUserProfilePage = () => {
    const [displayName, setDisplayName] = useState('');
    const [icon, setIcon] = useState('');
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { user, isLoading } = useUser();
    const navigate = useNavigate();

    const updateAccount = async () => {
        try {
            // await updateProfile(getAuth(), {displayName, icon});
            console.log("Updating profile: " + displayName + ":" + icon)
            // navigate('/');


            updateProfile(getAuth().currentUser, {
                displayName: displayName, photoURL: icon
              }).then(() => {
                // Profile updated!
                setMessage("Profile updated!");
                setError("");
              }).catch((error) => {
                // An error occurred
                setMessage("");
                setError(error.message);
              });

        } catch (e) {
            setError(e.message);
        }
    }

    useEffect(() => {
        // Define a function to retrieve the data
        const getUserData = async () => {
            console.log(user);
            if (user.displayName)
                setDisplayName(user.displayName);
        }
        if (!isLoading)
            getUserData();
     }, [isLoading, user]);

    return (
        <>
        <h1>Update Profile</h1>
        { error && <p className="error">{error}</p>}
        { message && <p className="message">{message}</p>}
        <input
            placeholder='Name'
            value={displayName}
            onChange={e => setDisplayName(e.target.value)} />
        <input
            placeholder='Icon'
            value={icon}
            onChange={e => setIcon(e.target.value)} />
        {/* <input
            placeholder='Your email address'
            value={email}
            onChange={e => setEmail(e.target.value)} />
        <input 
            type="password"
            placeholder='Your password'
            value={password}
            onChange={e => setPassword(e.target.value)} />
        <input 
            type="password"
            placeholder='Re-enter your password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)} /> */}
        <button onClick={updateAccount}>Save</button>
        {/* <Link to="/login">Already have an account? Log in here</Link> */}
        </>
    );
}

export default UpdateUserProfilePage;