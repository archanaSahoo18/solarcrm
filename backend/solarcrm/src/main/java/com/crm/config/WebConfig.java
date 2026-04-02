package com.crm.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Match the exact key from your properties file
    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Standardize the path format
        String location = uploadDir;
        
        // 1. Ensure it starts with file:
        if (!location.startsWith("file:")) {
            location = "file:" + location;
        }
        
        // 2. Ensure it ends with / so sub-folders (customer IDs) work
        if (!location.endsWith("/")) {
            location += "/";
        }

        registry.addResourceHandler("/files/**")
                .addResourceLocations(location)
                .setCachePeriod(3600);
                
        System.out.println("Mapping /files/** to physical path: " + location);
    }
}