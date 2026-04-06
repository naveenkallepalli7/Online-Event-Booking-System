package com.eventbooking.dto;

import com.eventbooking.model.BookingStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class BookingDto {
    private Long id;
    private Long eventId;
    private String eventTitle;
    private List<SeatDto> seats;
    private BigDecimal totalPrice;
    private BookingStatus status;
}
