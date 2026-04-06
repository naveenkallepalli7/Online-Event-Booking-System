import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [allBookings, setAllBookings] = useState([]); // For Admin
    const [allEvents, setAllEvents] = useState([]); // For Admin Events
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'events'
    
    // New Event form state
    const [newEvent, setNewEvent] = useState({
        title: '', description: '', date: '', time: '', venue: '', price: '', totalSeats: 50
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                if (user.role === 'ROLE_ADMIN') {
                    const [bookingsRes, eventsRes] = await Promise.all([
                        api.get('/bookings/all'),
                        api.get('/events/public/all')
                    ]);
                    setAllBookings(bookingsRes.data);
                    setAllEvents(eventsRes.data);
                } else {
                    const res = await api.get('/bookings/my-bookings');
                    setBookings(res.data);
                }
            } catch (err) {
                console.error("Dashboard fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user.role]);

    const handleDeleteEvent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await api.delete(`/events/${id}`);
            setAllEvents(allEvents.filter(e => e.id !== id));
            alert("Event deleted successfully.");
        } catch (err) {
            alert("Failed to delete event. It might have existing bookings.");
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/events', newEvent);
            setAllEvents([...allEvents, res.data]);
            setNewEvent({ title: '', description: '', date: '', time: '', venue: '', price: '', totalSeats: 50 });
            alert("Event created successfully!");
        } catch (err) {
            alert("Failed to create event. Please check inputs.");
        }
    };

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading dashboard...</div>;

    if (user.role === 'ROLE_ADMIN') {
        const totalRevenue = allBookings.reduce((sum, b) => sum + parseFloat(b.totalPrice), 0);
        return (
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ background: 'var(--primary)', color: 'white' }}>
                        <h3>Total Bookings</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{allBookings.length}</p>
                    </div>
                    <div className="card" style={{ background: 'var(--secondary)', color: 'white' }}>
                        <h3>Total Revenue</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>${totalRevenue.toFixed(2)}</p>
                    </div>
                </div>

                <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                    <button 
                        className={`btn ${activeTab === 'bookings' ? 'btn-primary' : ''}`}
                        onClick={() => setActiveTab('bookings')}
                        style={{ background: activeTab !== 'bookings' ? '#e5e7eb' : '', color: activeTab !== 'bookings' ? 'black' : '' }}
                    >Manage Bookings</button>
                    <button 
                        className={`btn ${activeTab === 'events' ? 'btn-primary' : ''}`}
                        onClick={() => setActiveTab('events')}
                        style={{ background: activeTab !== 'events' ? '#e5e7eb' : '', color: activeTab !== 'events' ? 'black' : '' }}
                    >Manage Events</button>
                </div>

                {activeTab === 'bookings' && (
                    <>
                        <h2>All Bookings</h2>
                        <div className="card" style={{ marginTop: '1rem', overflowX: 'auto' }}>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                        <th style={{ padding: '1rem' }}>ID</th>
                                        <th>Event</th>
                                        <th>Seats</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allBookings.map(b => (
                                        <tr key={b.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '1rem' }}>#{b.id}</td>
                                            <td>{b.eventTitle}</td>
                                            <td>{b.seats.map(s => s.seatNumber).join(', ')}</td>
                                            <td style={{ fontWeight: 'bold' }}>${b.totalPrice}</td>
                                            <td><span style={{ padding: '0.25rem 0.5rem', background: '#dcfce7', color: '#166534', borderRadius: '0.25rem', fontSize: '0.875rem' }}>{b.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'events' && (
                    <>
                        <div className="card" style={{ marginBottom: '2rem' }}>
                            <h2 style={{ marginBottom: '1rem' }}>Create New Event</h2>
                            <form onSubmit={handleCreateEvent} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="input-group">
                                    <label className="input-label">Title</label>
                                    <input type="text" className="input-field" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} required />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Venue</label>
                                    <input type="text" className="input-field" value={newEvent.venue} onChange={e => setNewEvent({...newEvent, venue: e.target.value})} required />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Date</label>
                                    <input type="date" className="input-field" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} required />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Time</label>
                                    <input type="time" className="input-field" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value + ":00"})} required />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Price ($)</label>
                                    <input type="number" step="0.01" className="input-field" value={newEvent.price} onChange={e => setNewEvent({...newEvent, price: e.target.value})} required />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Total Seats</label>
                                    <input type="number" className="input-field" value={newEvent.totalSeats} onChange={e => setNewEvent({...newEvent, totalSeats: parseInt(e.target.value)})} required />
                                </div>
                                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="input-label">Description</label>
                                    <textarea className="input-field" rows="3" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} required />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1' }}>Add Event & Generate Seats</button>
                            </form>
                        </div>

                        <h2>Existing Events</h2>
                        <div className="card" style={{ marginTop: '1rem', overflowX: 'auto' }}>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                        <th style={{ padding: '1rem' }}>ID</th>
                                        <th>Title</th>
                                        <th>Date</th>
                                        <th>Seats</th>
                                        <th>Price</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allEvents.map(e => (
                                        <tr key={e.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '1rem' }}>#{e.id}</td>
                                            <td>{e.title}</td>
                                            <td>{e.date}</td>
                                            <td>{e.availableSeats} / {e.totalSeats}</td>
                                            <td>${e.price}</td>
                                            <td>
                                                <button onClick={() => handleDeleteEvent(e.id)} className="btn btn-primary" style={{ background: 'var(--error)', padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>My Tickets</h1>
            {bookings.length === 0 ? (
                <p>You haven't booked any tickets yet.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                    {bookings.map(booking => (
                        <div key={booking.id} className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ padding: '0.5rem', background: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                                <QRCodeSVG value={`TICKET-${booking.id}-${booking.eventId}`} size={100} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{booking.eventTitle}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Booking ID: #{booking.id}</p>
                                <p><strong>Seats:</strong> {booking.seats.map(s => s.seatNumber).join(', ')}</p>
                                <p style={{ fontSize: '1.125rem', fontWeight: 'bold', marginTop: '0.5rem', color: 'var(--primary)' }}>${booking.totalPrice}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
