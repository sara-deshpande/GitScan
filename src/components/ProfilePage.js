import './ProfilePage.css';
import {useParams} from "react-router-dom";

const ProfilePage = () => {

    const { username }= useParams();
    return (
        <div className="profilepage">
            <h2>Profile Overview - {username} </h2>
            <p>GitHub profile data will show here</p>
        </div>
    );
}
 
export default ProfilePage;