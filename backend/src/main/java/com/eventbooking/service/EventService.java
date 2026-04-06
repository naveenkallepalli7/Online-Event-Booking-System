package com.eventbooking.service;

import com.eventbooking.dto.EventDto;
import com.eventbooking.model.Event;
import com.eventbooking.model.Seat;
import com.eventbooking.model.SeatStatus;
import com.eventbooking.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public List<EventDto> getAllEvents() {
        return eventRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public EventDto getEventById(Long id) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
        return mapToDto(event);
    }

    @Transactional
    public EventDto createEvent(EventDto eventDto) {
        Event event = new Event();
        event.setTitle(eventDto.getTitle());
        event.setDescription(eventDto.getDescription());
        event.setDate(eventDto.getDate());
        event.setTime(eventDto.getTime());
        event.setVenue(eventDto.getVenue());
        event.setPrice(eventDto.getPrice());

        // Assuming totalSeats is passed to generate default seats
        if (eventDto.getTotalSeats() > 0) {
            for (int i = 1; i <= eventDto.getTotalSeats(); i++) {
                Seat seat = Seat.builder()
                        .event(event)
                        .seatNumber("S" + i)
                        .status(SeatStatus.AVAILABLE)
                        .build();
                event.getSeats().add(seat);
            }
        }

        Event savedEvent = eventRepository.save(event);
        return mapToDto(savedEvent);
    }

    @Transactional
    public EventDto updateEvent(Long id, EventDto eventDto) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
        event.setTitle(eventDto.getTitle());
        event.setDescription(eventDto.getDescription());
        event.setDate(eventDto.getDate());
        event.setTime(eventDto.getTime());
        event.setVenue(eventDto.getVenue());
        event.setPrice(eventDto.getPrice());

        Event updatedEvent = eventRepository.save(event);
        return mapToDto(updatedEvent);
    }

    @Transactional
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    private EventDto mapToDto(Event event) {
        EventDto eventDto = new EventDto();
        eventDto.setId(event.getId());
        eventDto.setTitle(event.getTitle());
        eventDto.setDescription(event.getDescription());
        eventDto.setDate(event.getDate());
        eventDto.setTime(event.getTime());
        eventDto.setVenue(event.getVenue());
        eventDto.setPrice(event.getPrice());

        if (event.getSeats() != null) {
            eventDto.setTotalSeats(event.getSeats().size());
            eventDto.setAvailableSeats((int) event.getSeats().stream()
                    .filter(s -> s.getStatus() == SeatStatus.AVAILABLE)
                    .count());
        }

        return eventDto;
    }
}
