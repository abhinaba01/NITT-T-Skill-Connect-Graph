import React, { useState, useEffect } from 'react';
import * as api from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [newService, setNewService] = useState({ name: '', description: '' });
    const [selectedService, setSelectedService] = useState('');

    // Fetch all services on component mount
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await api.getAllServices();
                setServices(data);
                if (data.length > 0) {
                    setSelectedService(data[0].name);
                }
            } catch (err) {
                setError('Failed to fetch services.');
            }
        };
        fetchServices();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm) return;
        try {
            const results = await api.searchServices(searchTerm);
            setSearchResults(results);
        } catch (err) {
            setSearchResults([]);
            setError(`No providers found for "${searchTerm}".`);
        }
    };
    
    const handleCreateService = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const created = await api.createService(newService);
            setServices([...services, created]);
            setNewService({ name: '', description: '' });
            setSuccess(`Successfully created service: ${created.name}`);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleOfferService = async () => {
        if (!selectedService) return;
        setError('');
        setSuccess('');
        try {
            await api.offerService(selectedService);
            setSuccess(`You are now offering the service: ${selectedService}`);
        } catch (err) {
            setError(err.message);
        }
    };
    
    const handleUseService = async () => {
        if (!selectedService) return;
        setError('');
        setSuccess('');
        try {
            await api.useService(selectedService);
            setSuccess(`You are now using the service: ${selectedService}`);
        } catch (err) {
            setError(err.message);
        }
    };


    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to the NITT Skill Connect platform, {user.name} ({user.role})!</p>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            {/* Search for a Service */}
            <div className="card">
                <h2>Search for a Service</h2>
                <form onSubmit={handleSearch} className="form-group">
                    <input
                        type="text"
                        placeholder="e.g., Tutoring"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary" style={{marginTop: '0.5rem'}}>Search</button>
                </form>
                {searchResults.length > 0 && (
                    <div className="search-results">
                        <h3>Results for "{searchTerm}"</h3>
                        <ul>
                            {searchResults.map((result, index) => (
                                <li key={index}>
                                    <span className="provider">{result.provider}</span>
                                    <span className="role">({result.role})</span> offers this service.
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

             {/* Interact with Services */}
            <div className="card">
                <h2>Offer or Use a Service</h2>
                <div className="form-group">
                    <label htmlFor="service-select">Select an Existing Service</label>
                    <select 
                        id="service-select"
                        value={selectedService} 
                        onChange={(e) => setSelectedService(e.target.value)}
                    >
                        {services.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                    </select>
                </div>
                <button onClick={handleOfferService} className="btn btn-primary">Offer this Service</button>
                <button onClick={handleUseService} className="btn btn-secondary" style={{marginLeft: '1rem'}}>I Use this Service</button>
            </div>
            
            {/* Create a New Service */}
            <div className="card">
                <h2>Create a New Service</h2>
                 <form onSubmit={handleCreateService}>
                    <div className="form-group">
                        <label htmlFor="service-name">Service Name</label>
                        <input
                            type="text"
                            id="service-name"
                            value={newService.name}
                            onChange={(e) => setNewService({...newService, name: e.target.value})}
                            placeholder="e.g., Web Development"
                            required
                        />
                    </div>
                     <div className="form-group">
                        <label htmlFor="service-desc">Description</label>
                        <input
                            type="text"
                            id="service-desc"
                            value={newService.description}
                            onChange={(e) => setNewService({...newService, description: e.target.value})}
                            placeholder="Briefly describe the service"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Create Service</button>
                </form>
            </div>

            {/* List All Available Services */}
            <div className="card service-list">
                <h2>All Available Services</h2>
                <ul>
                    {services.map((service, index) => (
                        <li key={index}>
                            <strong>{service.name}</strong>
                            {service.description && `: ${service.description}`}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default HomePage;
