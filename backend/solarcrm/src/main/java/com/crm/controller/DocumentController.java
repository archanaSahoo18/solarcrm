package com.crm.controller;

import com.crm.entity.Document;
import com.crm.service.DocumentService;

import java.io.IOException;
import java.nio.file.Path;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin
public class DocumentController {

    private final DocumentService service;
    
    

    public DocumentController(DocumentService service) {
		this.service = service;
	}

    @PostMapping("/upload/{customerId}")
    public Document upload(@PathVariable Long customerId,
                           @RequestParam(required = false) MultipartFile aadhar,
                           @RequestParam(required = false) MultipartFile electricityBill,
                           @RequestParam(required = false) MultipartFile panCard,
                           @RequestParam(required = false) MultipartFile agreement,
                           @RequestParam(required = false) MultipartFile installationPhoto) throws Exception {

        return service.uploadFiles(customerId, aadhar, electricityBill, panCard, agreement, installationPhoto);
    }

    @GetMapping("/download/{customerId}/{type}")
    public ResponseEntity<Resource> download(@PathVariable Long customerId,
                                             @PathVariable String type) throws IOException {

        Document document = service.getByCustomerId(customerId);

        String fileName = switch (type) {
        case "aadhar" -> document.getAadharFile();
        case "bill" -> document.getElectricityBillFile();
        case "pan" -> document.getPanCardFile();
        case "agreement" -> document.getAgreementFile();
        case "install" -> document.getInstallationPhoto();
        default -> throw new RuntimeException("Invalid type");
    };

        if (fileName == null) {
            throw new RuntimeException("File not found");
        }

        Path path = service.getFilePath(customerId, fileName);

        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }
}