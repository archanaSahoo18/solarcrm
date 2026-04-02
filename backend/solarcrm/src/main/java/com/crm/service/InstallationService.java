package com.crm.service;

import com.crm.entity.Customer;
import com.crm.entity.Installation;
import com.crm.entity.InstallationHistory;
import com.crm.enums.InstallationStatus;
import com.crm.enums.Stage;
import com.crm.repository.CustomerRepository;
import com.crm.repository.InstallationHistoryRepository;
import com.crm.repository.InstallationRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class InstallationService {

    private final InstallationRepository installationRepository;
    private final CustomerRepository customerRepository;
    private final FileService fileService;
    private final InstallationHistoryRepository historyRepository;

    public InstallationService(
            InstallationRepository installationRepository,
            CustomerRepository customerRepository,
            FileService fileService,
            InstallationHistoryRepository historyRepository
    ) {
        this.installationRepository = installationRepository;
        this.customerRepository = customerRepository;
        this.fileService = fileService;
        this.historyRepository = historyRepository;
    }

    // ✅ CREATE or UPDATE
    public Installation saveInstallation(
            Long customerId,
            String teamName,
            Double expense,
            String status,
            String installationDate,
            String notes,
            MultipartFile photo
    ) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (customer.getStage() != Stage.FINANCE && customer.getStage() != Stage.INSTALLATION) {
            throw new RuntimeException("Finance must be completed before installation.");
        }

        LocalDate date = LocalDate.parse(installationDate);

        Installation installation = installationRepository.findByCustomerId(customerId);

        if (installation == null) {
            installation = new Installation();
            installation.setCustomer(customer);
        }

        InstallationStatus previousStatus = installation.getStatus();
        InstallationStatus finalStatus = parseStatus(status);

        // ❗ Prevent downgrade
        if (previousStatus == InstallationStatus.COMPLETED &&
                finalStatus != InstallationStatus.COMPLETED) {
            throw new RuntimeException("Cannot change status after completion");
        }

        installation.setTeamName(teamName);
        installation.setExpense(expense);
        installation.setInstallationDate(date);
        installation.setNotes(notes);
        installation.setStatus(finalStatus);

        // ✅ Photo logic
        if (finalStatus == InstallationStatus.COMPLETED) {

            if ((photo == null || photo.isEmpty()) && installation.getPhotoUrl() == null) {
                throw new RuntimeException("Photo required to complete installation");
            }

            if (photo != null && !photo.isEmpty()) {
                String fileName = fileService.saveFile(photo);
                installation.setPhotoUrl(fileName);
            }
        }

        Installation saved = installationRepository.save(installation);

        // ✅ Save history ONLY when status changes
        if (previousStatus == null || !previousStatus.equals(finalStatus)) {

            InstallationHistory history = new InstallationHistory();

            history.setCustomerId(customerId);
            history.setStatus(finalStatus);
            history.setTeamName(teamName);
            history.setExpense(expense);
            history.setNotes(notes);
            history.setInstallationDate(date);
            history.setUpdatedAt(LocalDateTime.now());

            if (saved.getPhotoUrl() != null) {
                history.setPhotoUrl(saved.getPhotoUrl());
            }

            historyRepository.save(history);
        }

        // ✅ Stage updates
        if (customer.getStage() == Stage.FINANCE) {
            customer.setStage(Stage.INSTALLATION);
        }

        if (saved.getStatus() == InstallationStatus.COMPLETED &&
                saved.getPhotoUrl() != null &&
                !saved.getPhotoUrl().isEmpty()) {

            customer.setStage(Stage.CONTRACT);
        }

        customerRepository.save(customer);

        return saved;
    }

    // ✅ GET Installation
    public Installation getByCustomerId(Long customerId) {
        return installationRepository.findByCustomerId(customerId);
    }

    // ✅ UPDATE by ID
    public Installation updateInstallation(
            Long id,
            String teamName,
            Double expense,
            String status,
            String installationDate,
            String notes,
            MultipartFile photo
    ) {

        Installation installation = installationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Installation not found"));

        InstallationStatus previousStatus = installation.getStatus();
        InstallationStatus finalStatus = parseStatus(status);

        if (previousStatus == InstallationStatus.COMPLETED &&
                finalStatus != InstallationStatus.COMPLETED) {
            throw new RuntimeException("Cannot change status after completion");
        }

        installation.setTeamName(teamName);
        installation.setExpense(expense);
        installation.setInstallationDate(LocalDate.parse(installationDate));
        installation.setNotes(notes);
        installation.setStatus(finalStatus);

        if (finalStatus == InstallationStatus.COMPLETED) {

            if ((photo == null || photo.isEmpty()) && installation.getPhotoUrl() == null) {
                throw new RuntimeException("Photo required");
            }

            if (photo != null && !photo.isEmpty()) {
            	String fileName = fileService.saveFile(photo);
            	installation.setPhotoUrl(fileName);
            }
        }

        Installation saved = installationRepository.save(installation);

        // ✅ Save history ONLY if changed
        if (!previousStatus.equals(finalStatus)) {

            InstallationHistory history = new InstallationHistory();

            history.setCustomerId(saved.getCustomer().getId());
            history.setStatus(finalStatus);
            history.setTeamName(teamName);
            history.setExpense(expense);
            history.setNotes(notes);
            history.setInstallationDate(LocalDate.parse(installationDate));
            history.setUpdatedAt(LocalDateTime.now());

            if (saved.getPhotoUrl() != null) {
                history.setPhotoUrl(saved.getPhotoUrl());
            }

            historyRepository.save(history);
        }

        return saved;
    }

    private InstallationStatus parseStatus(String status) {
        if (status == null || status.trim().isEmpty() || status.equalsIgnoreCase("undefined")) {
            return InstallationStatus.SCHEDULED;
        }

        try {
            return InstallationStatus.valueOf(status.toUpperCase());
        } catch (Exception e) {
            return InstallationStatus.SCHEDULED;
        }
    }
}