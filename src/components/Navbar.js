import './Navbar.css';
import {Link} from "react-router-dom"; 

const Navbar = () => {
    return ( 
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
            <div className="logo-dot"></div>
            <span>GitScan</span>
            </Link>
        </nav>
     );
}
 
export default Navbar;