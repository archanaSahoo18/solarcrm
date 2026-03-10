package com.crm.service;

import com.crm.entity.Customer;
import com.crm.entity.Note;
import com.crm.repository.CustomerRepository;
import com.crm.repository.NoteRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final CustomerRepository customerRepository;
    private final ActivityService activityService;

    public NoteService(NoteRepository noteRepository,
                       CustomerRepository customerRepository,
                       ActivityService activityService) {
        this.noteRepository = noteRepository;
        this.customerRepository = customerRepository;
        this.activityService = activityService;
    }

    public Note addNote(Long customerId, String content) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Note note = new Note();
        note.setCustomer(customer);
        note.setContent(content);
        note.setCreatedBy(username);
        note.setCreatedAt(LocalDateTime.now());

        Note savedNote = noteRepository.save(note);

        // Log in activity timeline
        activityService.logActivity(
                customer,
                "NOTE_ADDED",
                "Note added by " + username,
                username
        );

        return savedNote;
    }

    public List<Note> getNotes(Long customerId) {
        return noteRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }
}