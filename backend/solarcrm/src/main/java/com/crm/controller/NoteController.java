package com.crm.controller;

import com.crm.entity.Note;
import com.crm.service.NoteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers/{customerId}/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @PostMapping
    public Note addNote(@PathVariable Long customerId,
                        @RequestBody String content) {
        return noteService.addNote(customerId, content);
    }

    @GetMapping
    public List<Note> getNotes(@PathVariable Long customerId) {
        return noteService.getNotes(customerId);
    }
}