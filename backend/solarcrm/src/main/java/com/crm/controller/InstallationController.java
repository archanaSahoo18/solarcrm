package com.crm.controller;

import com.crm.entity.Installation;
import com.crm.entity.InstallationHistory;
import com.crm.repository.InstallationHistoryRepository;
import com.crm.service.InstallationService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/installation")
@CrossOrigin
public class InstallationController {

    private final InstallationService service;
    private final InstallationHistoryRepository historyRepository;



    public InstallationController(InstallationService service, InstallationHistoryRepository historyRepository) {
		this.service = service;
		this.historyRepository = historyRepository;
	}

	// ✅ CREATE or UPDATE (same API)
    @PostMapping("/{customerId}")
    public Installation addOrUpdateInstallation(
            @PathVariable Long customerId,
            @RequestParam String teamName,
            @RequestParam Double expense,
            @RequestParam String status,
            @RequestParam String installationDate,
            @RequestParam(required = false) String notes,
            @RequestParam(required = false) MultipartFile photo
    ) {
        return service.saveInstallation(
                customerId, teamName, expense, status, installationDate, notes, photo
        );
    }

    // ✅ NEW: GET installation by customerId (FIXES YOUR ISSUE 🔥)
    @GetMapping("/{customerId}")
    public ResponseEntity<?> getInstallation(@PathVariable Long customerId) {
        Installation installation = service.getByCustomerId(customerId);

        if (installation == null) {
            return ResponseEntity.ok(null);
        }

        return ResponseEntity.ok(installation);
    }

    // ✅ OPTIONAL: Update using ID (clean API design)
    @PutMapping("/{id}")
    public Installation updateInstallation(
            @PathVariable Long id,
            @RequestParam String teamName,
            @RequestParam Double expense,
            @RequestParam String status,
            @RequestParam String installationDate,
            @RequestParam(required = false) String notes,
            @RequestParam(required = false) MultipartFile photo
    ) {
        return service.updateInstallation(
                id, teamName, expense, status, installationDate, notes, photo
        );
    }
    
    
    

    @GetMapping("/history/{customerId}")
    public List<InstallationHistory> getHistory(@PathVariable Long customerId) {
        return historyRepository.findByCustomerIdOrderByUpdatedAtAsc(customerId);
    }
}

//	@PostMapping("/{customerId}")
//    public Installation addInstallation(@PathVariable Long customerId,
//                                        @RequestBody Installation installation) {
//        return service.saveInstallation(customerId, installation);
//    }
