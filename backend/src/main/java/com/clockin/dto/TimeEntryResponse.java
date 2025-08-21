package com.clockin.dto;

import java.time.LocalDateTime;

public class TimeEntryResponse {
    
    private Long id;
    private String firstName;
    private String lastName;
    private LocalDateTime clockInTime;
    private LocalDateTime clockOutTime;
    private Double totalHours;
    private Boolean isActive;
    
    // Constructors
    public TimeEntryResponse() {}
    
    public TimeEntryResponse(Long id, String firstName, String lastName, LocalDateTime clockInTime, 
                           LocalDateTime clockOutTime, Double totalHours, Boolean isActive) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.clockInTime = clockInTime;
        this.clockOutTime = clockOutTime;
        this.totalHours = totalHours;
        this.isActive = isActive;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public LocalDateTime getClockInTime() {
        return clockInTime;
    }
    
    public void setClockInTime(LocalDateTime clockInTime) {
        this.clockInTime = clockInTime;
    }
    
    public LocalDateTime getClockOutTime() {
        return clockOutTime;
    }
    
    public void setClockOutTime(LocalDateTime clockOutTime) {
        this.clockOutTime = clockOutTime;
    }
    
    public Double getTotalHours() {
        return totalHours;
    }
    
    public void setTotalHours(Double totalHours) {
        this.totalHours = totalHours;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
} 