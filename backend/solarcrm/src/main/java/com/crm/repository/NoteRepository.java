package com.crm.repository;

import com.crm.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
}