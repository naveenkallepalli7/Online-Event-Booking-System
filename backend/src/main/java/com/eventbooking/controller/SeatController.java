package com.eventbooking.controller;

import com.eventbooking.dto.SeatDto;
import com.eventbooking.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    @GetMapping("/public/event/{eventId}")
    public ResponseEntity<List<SeatDto>> getSeatsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(seatService.getSeatsByEvent(eventId));
    }
}
