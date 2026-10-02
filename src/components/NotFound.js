import {Link} from "react-router-dom";
import "./NotFound.css";
import {useEffect} from 'react';

const NotFound = () => {

    useEffect(() => {
        document.title = 'GitScan | Page not found';
    }, []);

    
    return ( <div className="not-found">
        <h2>404</h2>
        <h3>Page Not Found</h3>
        <Link to="/">Go Back to GitScan</Link>
    </div> );
}
 
export default NotFound;