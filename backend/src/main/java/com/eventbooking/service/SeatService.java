package com.eventbooking.service;

import com.eventbooking.dto.SeatDto;
import com.eventbooking.model.Seat;
import com.eventbooking.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeatService {

    private final SeatRepository seatRepository;

    public List<SeatDto> getSeatsByEvent(Long eventId) {
        List<Seat> seats = seatRepository.findByEventId(eventId);
        return seats.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private SeatDto mapToDto(Seat seat) {
        SeatDto seatDto = new SeatDto();
        seatDto.setId(seat.getId());
        seatDto.setSeatNumber(seat.getSeatNumber());
        seatDto.setStatus(seat.getStatus());
        return seatDto;
    }
}
