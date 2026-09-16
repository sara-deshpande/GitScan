import {useState} from 'react';

const useGitHub = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [profileData, setProfileData] = useState(null);  
    const [repos, setRepos] = useState([]);  
    const [error, setError] = useState('');   

    const fetchGitHubData = (username) => {

        setIsLoading(true);
        setError('');
        setProfileData(null);
        setRepos([]);

        const abortController = new AbortController();

        Promise.all([
            fetch(`https://api.github.com/users/${username}`, {signal: abortController.signal }).then(res => res.json()), //endpoints
            fetch(`https://api.github.com/users/${username}/repos`,  {signal: abortController.signal }).then(res => res.json())  //endpoints
        ])
        .then(([userData, reposData]) => {

            if (userData.message === 'Not Found') {
                setError('GitHub user not found. Check the username and try again');
                setIsLoading(false);
                return;
            }

            if (userData.message === 'API rate limit exceeded'){
                setError('GitHub API rate limit reached. Please wait an hour and try again.');
                setIsLoading(false);
                return;
            }
            setProfileData(userData);
            setRepos(reposData);
            setIsLoading(false);
        })
        .catch(err => {
            if (err.name === 'AbortError') {
                console.log('Frtch Aborted');
                return;
            }
            setError('Something went wrong. Check your connection and try again later');
            setIsLoading(false);
        });

        return abortController;
    };

    return {profileData, repos, isLoading, error, fetchGitHubData};
}

export default useGitHub;