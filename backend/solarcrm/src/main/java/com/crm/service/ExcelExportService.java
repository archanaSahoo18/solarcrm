package com.crm.service;

import com.crm.entity.Customer;
import com.crm.repository.CustomerRepository;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class ExcelExportService {

    private final CustomerRepository repository;
    
    

    public ExcelExportService(CustomerRepository repository) {
		this.repository = repository;
	}



	public byte[] exportCustomers() throws Exception {

        List<Customer> customers = repository.findAll();

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Solar CRM Report");

        sheet.setZoom(80);

        // Header style (bold)
        CellStyle headerStyle = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        headerStyle.setFont(font);

        // Header row
        Row header = sheet.createRow(0);

        String[] headers = {
                "ID",
                "Customer Name",
                "Phone",
                "Address",
                "Stage",
                "Finance Type",
                "Loan Amount",
                "Down Payment",
                "Installation Team",
                "Installation Date"
        };

        for (int i = 0; i < headers.length; i++) {

            Cell cell = header.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);

        }

        int rowNum = 1;

        for (Customer c : customers) {

            Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(c.getId());
            row.createCell(1).setCellValue(c.getName());
            row.createCell(2).setCellValue(c.getPhone());
            row.createCell(3).setCellValue(c.getAddress());
            row.createCell(4).setCellValue(c.getStage().name());

            // Finance Details
            if (c.getFinance() != null) {

                row.createCell(5).setCellValue(
                        c.getFinance().getFinanceType() != null
                                ? c.getFinance().getFinanceType()
                                : ""
                );

                row.createCell(6).setCellValue(
                        c.getFinance().getLoanAmount() != null
                                ? "₹" + c.getFinance().getLoanAmount()
                                : "₹0"
                );

                row.createCell(7).setCellValue(
                        c.getFinance().getDownPayment() != null
                                ? "₹" + c.getFinance().getDownPayment()
                                : "₹0"
                );
            }

            // Installation Details
            if (c.getInstallation() != null) {

                row.createCell(8).setCellValue(
                        c.getInstallation().getTeamName() != null
                                ? c.getInstallation().getTeamName()
                                : ""
                );

                row.createCell(9).setCellValue(
                        c.getInstallation().getInstallationDate() != null
                                ? c.getInstallation().getInstallationDate().toString()
                                : ""
                );
            }
        }

        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        workbook.write(out);
        workbook.close();

        return out.toByteArray();
    }
}