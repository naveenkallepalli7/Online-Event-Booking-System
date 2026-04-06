import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket } from 'lucide-react';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events/public/all');
                setEvents(res.data);
            } catch (err) {
                console.error('Error fetching events:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading events...</div>;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: '700' }}>Upcoming Events</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {events.map(event => (
                    <div key={event.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', height: '150px', borderRadius: '0.375rem', marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{event.title}</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', flexGrow: 1 }}>{event.description}</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Calendar size={16} color="var(--primary)" /> {event.date} at {event.time}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin size={16} color="var(--primary)" /> {event.venue}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Ticket size={16} color="var(--primary)" /> {event.availableSeats} / {event.totalSeats} seats available
                            </span>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>${event.price}</span>
                            <Link to={`/events/${event.id}`} className="btn btn-primary">Book Now</Link>
                        </div>
                    </div>
                ))}
                {events.length === 0 && <p>No events available at the moment.</p>}
            </div>
        </div>
    );
};

export default Home;
