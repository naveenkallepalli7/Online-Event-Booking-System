package com.eventbooking.dto;

import com.eventbooking.model.SeatStatus;
import lombok.Data;

@Data
public class SeatDto {
    private Long id;
    private String seatNumber;
    private SeatStatus status;
}
