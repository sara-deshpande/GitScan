import './ProfilePage.css';
import {useParams} from "react-router-dom";
import {useEffect} from 'react';
import useGitHub from '../hooks/useGitHub';

const ProfilePage = () => {

    const { username }= useParams();
    const {profileData, repos, isLoading, error, fetchGitHubData} = useGitHub();

    useEffect (() => {
        if (username ) {
            fetchGitHubData(username);
        }
    }, [username]);

    return (
        <div className="profilepage">
            {isLoading && <div>Loading...</div>}
            {error && <div>{error}</div>}
        </div>
    );
}
 
export default ProfilePage;