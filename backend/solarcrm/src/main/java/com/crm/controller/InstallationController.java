package com.crm.controller;

import com.crm.entity.Installation;
import com.crm.service.InstallationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/installation")
@CrossOrigin
public class InstallationController {

    private final InstallationService service;
    
    

    public InstallationController(InstallationService service) {
		this.service = service;
	}



	@PostMapping("/{customerId}")
    public Installation addInstallation(@PathVariable Long customerId,
                                        @RequestBody Installation installation) {
        return service.saveInstallation(customerId, installation);
    }
}