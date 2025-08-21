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
@RequestMapping("/api/time-entries")
@CrossOrigin(origins = "http://localhost:3000")
public class TimeEntryController {
    
    @Autowired
    private TimeEntryService timeEntryService;
    
    private static final String ACCESS_CODE = "777";
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        if (!ACCESS_CODE.equals(loginRequest.getAccessCode())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid access code"));
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("firstName", loginRequest.getFirstName());
        response.put("lastName", loginRequest.getLastName());
        
        // Check current status
        TimeEntryResponse currentStatus = timeEntryService.getCurrentStatus(
                loginRequest.getFirstName(), loginRequest.getLastName());
        response.put("currentStatus", currentStatus);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/clock-in")
    public ResponseEntity<?> clockIn(@Valid @RequestBody LoginRequest loginRequest) {
        if (!ACCESS_CODE.equals(loginRequest.getAccessCode())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid access code"));
        }
        
        try {
            TimeEntryResponse response = timeEntryService.clockIn(
                    loginRequest.getFirstName(), loginRequest.getLastName());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/clock-out")
    public ResponseEntity<?> clockOut(@Valid @RequestBody LoginRequest loginRequest) {
        if (!ACCESS_CODE.equals(loginRequest.getAccessCode())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid access code"));
        }
        
        try {
            TimeEntryResponse response = timeEntryService.clockOut(
                    loginRequest.getFirstName(), loginRequest.getLastName());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/history/{firstName}/{lastName}")
    public ResponseEntity<?> getHistory(@PathVariable String firstName, 
                                       @PathVariable String lastName,
                                       @RequestParam String accessCode) {
        if (!ACCESS_CODE.equals(accessCode)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid access code"));
        }
        
        List<TimeEntryResponse> history = timeEntryService.getEmployeeHistory(firstName, lastName);
        return ResponseEntity.ok(history);
    }
    
    @GetMapping("/status/{firstName}/{lastName}")
    public ResponseEntity<?> getCurrentStatus(@PathVariable String firstName, 
                                             @PathVariable String lastName,
                                             @RequestParam String accessCode) {
        if (!ACCESS_CODE.equals(accessCode)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid access code"));
        }
        
        TimeEntryResponse status = timeEntryService.getCurrentStatus(firstName, lastName);
        return ResponseEntity.ok(status);
    }
} 