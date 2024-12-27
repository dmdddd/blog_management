import { useState, useEffect } from 'react';
import { getAuth, updateProfile  } from 'firebase/auth';
import useUser from "../hooks/useUser";
import axios from 'axios';
import { toast } from '../components/ui/Toast';


const UpdateUserProfilePage = () => {
    const [displayName, setDisplayName] = useState('');
    const [icon, setIcon] = useState('');
    const { user, isLoading } = useUser();

    const updateAccount = async () => {
        try {
            console.log("Updating profile: " + displayName + ":" + icon)

            updateProfile(getAuth().currentUser, {
                displayName: displayName, photoURL: icon
              }).then(async () => {
                toast.success("Profile updated!");

                const token = user && await user.getIdToken();
                const headers = token ? { authtoken: token } : {};
                await axios.post(`/api/comments/updateIcon`, {
                    photoURL:icon,
                }, {
                    headers,
                });

              }).catch((error) => {
                // An error occurred
                toast.error(error.message);
              });

        } catch (e) {
            toast.error(e.message);
        }
    }

    useEffect(() => {
        // Define a function to retrieve the data
        const getUserData = async () => {
            // console.log(user);
            if (user.displayName) {
                setDisplayName(user.displayName);
                setIcon(user.photoURL);
            }
        }
        if (!isLoading)
            getUserData();
     }, [isLoading, user]);

    return (
        <>
        <h1>Update Profile</h1>
        <input
            placeholder='Display Name'
            value={displayName}
            onChange={e => setDisplayName(e.target.value)} />
        <input
            placeholder='Icon'
            value={icon}
            onChange={e => setIcon(e.target.value)} />
        <button onClick={updateAccount}>Save</button>
        </>
    );
}

export default UpdateUserProfilePage;