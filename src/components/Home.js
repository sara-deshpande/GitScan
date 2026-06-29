import './Home.css';

const Home = () => {
    const handleClick = () => {
        console.log('Profile Scanned');
    }

    return ( 
        <div className="home">
            <h2>Analyze your Github profile</h2>
            <p>Get recruiter perspective feedback based on your target roles</p>
            <button onClick={handleClick}> Scan Profile </button>
        </div>
     );
}
 
export default Home; 