package com.clockin.controller;

import com.clockin.dto.LoginRequest;
import com.clockin.dto.TimeEntryResponse;
import com.clockin.service.TimeEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
    
    @Autowired
    private TimeEntryService timeEntryService;
    
    private static final String ADMIN_ACCESS_CODE = "888";
    
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@Valid @RequestBody LoginRequest loginRequest) {
        if (!ADMIN_ACCESS_CODE.equals(loginRequest.getAccessCode())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid admin access code"));
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Admin login successful");
        response.put("isAdmin", true);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/all-employees")
    public ResponseEntity<?> getAllEmployeesData(@RequestParam String accessCode) {
        if (!ADMIN_ACCESS_CODE.equals(accessCode)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid admin access code"));
        }
        
        try {
            List<Map<String, Object>> employeesData = timeEntryService.getAllEmployeesData();
            return ResponseEntity.ok(employeesData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/employee/{firstName}/{lastName}")
    public ResponseEntity<?> getEmployeeData(@PathVariable String firstName, 
                                           @PathVariable String lastName,
                                           @RequestParam String accessCode) {
        if (!ADMIN_ACCESS_CODE.equals(accessCode)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid admin access code"));
        }
        
        try {
            List<TimeEntryResponse> employeeData = timeEntryService.getEmployeeHistory(firstName, lastName);
            Map<String, Object> response = new HashMap<>();
            response.put("firstName", firstName);
            response.put("lastName", lastName);
            response.put("entries", employeeData);
            
            // Calculate summary statistics
            double totalHours = employeeData.stream()
                    .filter(entry -> entry.getTotalHours() != null)
                    .mapToDouble(TimeEntryResponse::getTotalHours)
                    .sum();
            
            long totalEntries = employeeData.size();
            long activeEntries = employeeData.stream()
                    .filter(TimeEntryResponse::getIsActive)
                    .count();
            
            response.put("totalHours", Math.round(totalHours * 100.0) / 100.0);
            response.put("totalEntries", totalEntries);
            response.put("activeEntries", activeEntries);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(@RequestParam String accessCode) {
        if (!ADMIN_ACCESS_CODE.equals(accessCode)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid admin access code"));
        }
        
        try {
            Map<String, Object> summary = timeEntryService.getAdminSummary();
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/employee/{firstName}/{lastName}/weekly")
    public ResponseEntity<?> getEmployeeWeeklyData(@PathVariable String firstName, 
                                                  @PathVariable String lastName,
                                                  @RequestParam String accessCode) {
        if (!ADMIN_ACCESS_CODE.equals(accessCode)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid admin access code"));
        }
        
        try {
            Map<String, Object> weeklyData = timeEntryService.getEmployeeWeeklyData(firstName, lastName);
            return ResponseEntity.ok(weeklyData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
} 