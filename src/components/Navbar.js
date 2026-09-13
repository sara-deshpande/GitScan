import './Navbar.css';
import {Link, NavLink} from "react-router-dom"; 

const Navbar = () => {
    return ( 
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
            <div className="logo-dot"></div>
            <span>GitScan</span>
            </Link>
            <div className="navbar-links">
                <NavLink to="/" end className ={({isActive}) => isActive ? 'active' : '' }>Home</NavLink>
                <NavLink to="/profile" end className ={({isActive}) => isActive ? 'active' : '' }>Profile</NavLink>
                <NavLink to="/results" end className ={({isActive}) => isActive ? 'active' : '' }>Results</NavLink>
                <NavLink to="/action-plan" end className ={({isActive}) => isActive ? 'active' : '' }>Action Plan</NavLink>
            </div>
        </nav>
     );
}
 
export default Navbar;