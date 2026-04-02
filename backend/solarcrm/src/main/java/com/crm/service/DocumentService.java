package com.crm.service;

import com.crm.config.FileStorageProperties;
import com.crm.entity.Customer;
import com.crm.entity.Document;
import com.crm.enums.Stage;
import com.crm.repository.CustomerRepository;
import com.crm.repository.DocumentRepository;


import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final CustomerRepository customerRepository;
    private final FileStorageProperties properties;
    private final ActivityService activityService;
    
    

    public DocumentService(DocumentRepository documentRepository, CustomerRepository customerRepository,
			FileStorageProperties properties,ActivityService activityService) {
		this.documentRepository = documentRepository;
		this.customerRepository = customerRepository;
		this.properties = properties;
		this.activityService = activityService;
	}

	private static final List<String> ALLOWED_TYPES =
            List.of("application/pdf", "image/jpeg", "image/png");

    public Document uploadFiles(Long customerId,
                                MultipartFile aadhar,
                                MultipartFile panCard,
                                MultipartFile electricityBill,
                                MultipartFile agreement,
                                MultipartFile installationPhoto) throws IOException {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        String customerDir = properties.getUploadDir() + "/" + customerId;
        Files.createDirectories(Paths.get(customerDir));

        Document document = documentRepository
                .findByCustomerId(customerId)
                .orElse(new Document());

        document.setCustomer(customer);

        document.setAadharFile(saveFile(customerDir, aadhar, document.getAadharFile()));
        document.setPanCardFile(saveFile(customerDir, panCard, document.getPanCardFile()));
        document.setElectricityBillFile(saveFile(customerDir, electricityBill, document.getElectricityBillFile()));
        document.setAgreementFile(saveFile(customerDir, agreement, document.getAgreementFile()));
        document.setInstallationPhoto(saveFile(customerDir, installationPhoto, document.getInstallationPhoto()));
        customer.setStage(Stage.DOCUMENTS);
        customerRepository.save(customer);
        
        
        

        Document savedDoc = documentRepository.save(document);

        if (customer.getStage() == Stage.IDENTIFICATION) {
            customer.setStage(Stage.DOCUMENTS);
            customerRepository.save(customer);
        }
        
        activityService.logActivity(
        	    customer,
        	    "DOCUMENT_UPLOADED",
        	    "Customer documents uploaded",
        	    SecurityContextHolder.getContext().getAuthentication().getName()
        	);

        return savedDoc;
        
    }

    private String saveFile(String directory,
                            MultipartFile file,
                            String oldFile) throws IOException {

        if (file == null || file.isEmpty()) return oldFile;
        
        if(file.getSize() > 5 * 1024 * 1024){
            throw new RuntimeException("File size should be less than 5MB");
        }

        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new RuntimeException("Invalid file type");
        }

        String cleanName = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = cleanName.substring(cleanName.lastIndexOf("."));

        String newFileName = UUID.randomUUID() + extension;
        Path path = Paths.get(directory, newFileName);

        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

        // delete old file
        if (oldFile != null) {
            Files.deleteIfExists(Paths.get(directory, oldFile));
        }

        return newFileName;
    }
    
    public Document getByCustomerId(Long customerId) {
        return documentRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }
    
    public Path getFilePath(Long customerId, String fileName) {
        return Paths.get(properties.getUploadDir(), customerId.toString(), fileName);
    }

	public Document   saveDocuments(Long customerId,
            MultipartFile aadhar,
            MultipartFile panCard,
            MultipartFile sitePhoto,
            MultipartFile bankPassbook,
            MultipartFile electricityBill,
            MultipartFile agreement,
            MultipartFile customerPhoto)throws IOException  {
		
		Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        String customerDir = properties.getUploadDir() + "/" + customerId;

        Files.createDirectories(Paths.get(customerDir));

        Document document = documentRepository
                .findByCustomerId(customerId)
                .orElse(new Document());

        document.setCustomer(customer);

        document.setAadharFile(
                saveFile(customerDir, aadhar, document.getAadharFile())
        );

        document.setPanCardFile(
                saveFile(customerDir, panCard, document.getPanCardFile())
        );

        document.setSitePhoto(
                saveFile(customerDir, sitePhoto, document.getSitePhoto())
        );

        document.setBankPassbook(
                saveFile(customerDir, bankPassbook, document.getBankPassbook())
        );

        document.setElectricityBillFile(
                saveFile(customerDir, electricityBill, document.getElectricityBillFile())
        );

        document.setAgreementFile(
                saveFile(customerDir, agreement, document.getAgreementFile())
        );

        document.setCustomerPhoto(
                saveFile(customerDir, customerPhoto, document.getCustomerPhoto())
        );

        Document savedDoc = documentRepository.save(document);

        activityService.logActivity(
                customer,
                "DOCUMENT_UPLOADED",
                "Customer documents uploaded",
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getName()
        );

        return savedDoc;
    
		
	}
}