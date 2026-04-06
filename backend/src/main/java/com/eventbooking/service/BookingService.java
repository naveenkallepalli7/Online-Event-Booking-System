package com.eventbooking.service;

import com.eventbooking.dto.BookingDto;
import com.eventbooking.dto.BookingRequest;
import com.eventbooking.dto.SeatDto;
import com.eventbooking.model.*;
import com.eventbooking.repository.BookingRepository;
import com.eventbooking.repository.EventRepository;
import com.eventbooking.repository.SeatRepository;
import com.eventbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;

    @Transactional
    public BookingDto createBooking(String email, BookingRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());

        // Validate seats belong to event and are available
        for (Seat seat : seats) {
            if (!seat.getEvent().getId().equals(event.getId())) {
                throw new RuntimeException("Seat does not belong to the selected event");
            }
            if (seat.getStatus() != SeatStatus.AVAILABLE) {
                throw new RuntimeException("Seat " + seat.getSeatNumber() + " is already booked");
            }
        }

        // Mock payment process (assuming successful)
        boolean paymentSuccess = mockPaymentGateway(request.getSeatIds().size(), event.getPrice());
        if (!paymentSuccess) {
            throw new RuntimeException("Payment failed");
        }

        // Update seat status to BOOKED
        seats.forEach(seat -> seat.setStatus(SeatStatus.BOOKED));
        seatRepository.saveAll(seats);

        // Calculate total price
        BigDecimal totalPrice = event.getPrice().multiply(new BigDecimal(seats.size()));

        // Create booking
        Booking booking = Booking.builder()
                .user(user)
                .event(event)
                .bookedSeats(seats)
                .totalPrice(totalPrice)
                .status(BookingStatus.CONFIRMED)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        return mapToDto(savedBooking);
    }

    public List<BookingDto> getUserBookings(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Booking> bookings = bookingRepository.findByUserId(user.getId());
        return bookings.stream().map(this::mapToDto).collect(Collectors.toList());
    }
    
    public List<BookingDto> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private boolean mockPaymentGateway(int numberOfSeats, BigDecimal price) {
        // Mocking a successful payment 99% of the time
        return Math.random() > 0.01;
    }

    private BookingDto mapToDto(Booking booking) {
        BookingDto dto = new BookingDto();
        dto.setId(booking.getId());
        dto.setEventId(booking.getEvent().getId());
        dto.setEventTitle(booking.getEvent().getTitle());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus());

        List<SeatDto> seatDtos = booking.getBookedSeats().stream().map(seat -> {
            SeatDto sDto = new SeatDto();
            sDto.setId(seat.getId());
            sDto.setSeatNumber(seat.getSeatNumber());
            sDto.setStatus(seat.getStatus());
            return sDto;
        }).collect(Collectors.toList());

        dto.setSeats(seatDtos);
        return dto;
    }
}
