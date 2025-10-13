import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AuthForm = ({ isLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Student', // Default role
    });
    const [error, setError] = useState('');
    const { login, register } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                });
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="form-container card">
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                {!isLogin && (
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select name="role" id="role" value={formData.role} onChange={handleChange}>
                            <option value="Student">Student</option>
                            <option value="Faculty">Faculty</option>
                            <option value="Staff">Staff</option>
                            <option value="Alumni">Alumni</option>
                        </select>
                    </div>
                )}
                <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
                    {isLogin ? 'Login' : 'Create Account'}
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>
            <div style={{marginTop: '1rem', textAlign: 'center'}}>
                {isLogin ? (
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                ) : (
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                )}
            </div>
        </div>
    );
};

export default AuthForm;
