import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { Calendar, MapPin, DollarSign } from 'lucide-react';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchEventAndSeats = async () => {
            try {
                const [eventRes, seatsRes] = await Promise.all([
                    api.get(`/events/public/${id}`),
                    api.get(`/seats/public/event/${id}`)
                ]);
                setEvent(eventRes.data);
                setSeats(seatsRes.data);
            } catch (err) {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };
        fetchEventAndSeats();
    }, [id]);

    const toggleSeat = (seatId, status) => {
        if (status !== 'AVAILABLE') return;
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (selectedSeats.length === 0) return;
        
        setBooking(true);
        try {
            await api.post('/bookings', {
                eventId: event.id,
                seatIds: selectedSeats
            });
            alert('Tickets booked successfully! Redirecting to Dashboard...');
            navigate('/dashboard');
        } catch (err) {
            alert('Failed to book tickets. They might have been taken recently or payment failed.');
            setBooking(false);
        }
    };

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading details...</div>;
    if (error || !event) return <div className="container" style={{ padding: '2rem', color: 'red' }}>{error}</div>;

    const totalPrice = (selectedSeats.length * parseFloat(event.price)).toFixed(2);

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', height: '200px', borderRadius: '0.375rem', marginBottom: '1.5rem' }} />
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>{event.title}</h1>
                <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{event.description}</p>
                
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem' }}>
                        <Calendar color="var(--primary)" /> {event.date} at {event.time}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem' }}>
                        <MapPin color="var(--primary)" /> {event.venue}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem', fontWeight: 'bold' }}>
                        <DollarSign color="var(--secondary)" /> {event.price} / ticket
                    </span>
                </div>
            </div>

            <div className="card">
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Select Your Seats</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '10px', marginBottom: '2rem' }}>
                    {seats.map(seat => {
                        const isSelected = selectedSeats.includes(seat.id);
                        const isAvailable = seat.status === 'AVAILABLE';
                        return (
                            <button
                                key={seat.id}
                                onClick={() => toggleSeat(seat.id, seat.status)}
                                disabled={!isAvailable}
                                style={{
                                    padding: '0.5rem',
                                    borderRadius: '0.25rem',
                                    border: '1px solid #d1d5db',
                                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                                    backgroundColor: !isAvailable ? '#fca5a5' : (isSelected ? 'var(--secondary)' : '#f3f4f6'),
                                    color: isSelected || !isAvailable ? 'white' : 'black',
                                    fontWeight: '500',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {seat.seatNumber}
                            </button>
                        );
                    })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                    <div>
                        <span style={{ fontSize: '1.125rem' }}>Selected Seats: <strong>{selectedSeats.length}</strong></span>
                        <br />
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Total: ${totalPrice}</span>
                    </div>
                    <button 
                        className="btn btn-primary" 
                        onClick={handleBooking} 
                        disabled={selectedSeats.length === 0 || booking}
                        style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}
                    >
                        {booking ? 'Processing...' : 'Confirm Booking'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
