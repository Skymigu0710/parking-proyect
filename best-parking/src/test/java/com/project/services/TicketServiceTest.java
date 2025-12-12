package com.project.services;

import com.project.models.Ticket;
import com.project.repositories.TicketRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @InjectMocks
    private TicketService ticketService;

    @Test
    void testGetTicketById_found() {
        // ARRANGE
        Long id = 11L;
        Ticket ticket = new Ticket();
        ticket.setId(id);

        when(ticketRepository.findById(id)).thenReturn(Optional.of(ticket));

        // ACT
        Ticket result = ticketService.getTicketById(id);

        // ASSERT
        assertNotNull(result);
        assertEquals(id, result.getId());
        verify(ticketRepository, times(1)).findById(id);
    }

    @Test
    void testGetTicketById_NoExiste() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> ticketService.getTicketById(1L)
        );

        assertEquals("Ticket no encontrado con id: 1", exception.getMessage());
    }

}
