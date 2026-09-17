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

    if (isLoading) {
        return(
            <div className="loading">
                <p>Loading profile....</p>
            </div>
        );
    }

    if (error){
        return(
            <div className="error">
                <p>{error}</p>
            </div>
        );
    }

    if(!profileData){
        return null;
    }

    return (
        <div className="profilepage">
            <div className="profile-header">
            <img
                    src={profileData.avatar_url}
                    alt={`${profileData.login} avatar`}
                    className="profile-avatar"
                />
                <div className="profile-info">
                <h2>{profileData.name || profileData.login}</h2>
                    <p className="profile-username">@{profileData.login}</p>
                    {profileData.bio && <p className="profile-bio">{profileData.bio}</p>}
                    {profileData.location && <p className="profile-location">📍 {profileData.location}</p>}
                    
                </div>
            </div>
        </div>
    );
}
 
export default ProfilePage;