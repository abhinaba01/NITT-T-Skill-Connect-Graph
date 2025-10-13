import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="header">
        <Link to="/" style={{textDecoration: 'none'}}><h1>NITT Skill Connect</h1></Link>
      <nav>
        {isAuthenticated ? (
            <>
                <span>Welcome, {user?.name}!</span>
                <button onClick={logout} style={{marginLeft: '1rem'}}>Logout</button>
            </>
        ) : (
          <div>
            <Link to="/login">Login</Link>
            <Link to="/register" style={{marginLeft: '1rem'}}>Register</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
