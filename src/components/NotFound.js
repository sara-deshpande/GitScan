import {Link} from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
    return ( <div className="not-found">
        <h2>404</h2>
        <h3>Page Not Found</h3>
        <Link to="/">Go Back to GitScan</Link>
    </div> );
}
 
export default NotFound;