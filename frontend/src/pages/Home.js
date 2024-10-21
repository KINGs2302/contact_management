import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import '../css/Home.css'; 
import UserTable from '../Table/UserTable';
function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    return (
        <div>
            {/* Navigation Bar */}
            <nav className="navbar">
                <h1 className="nav-title">Contact Management</h1>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </nav>
            
            {/* Welcome Message */}
            <div className="content">
                <h1>Welcome {loggedInUser}</h1>
                <UserTable />
            </div>

        </div>
    );
}

export default Home;
