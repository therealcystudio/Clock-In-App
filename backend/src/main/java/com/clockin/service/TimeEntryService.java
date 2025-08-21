package com.clockin.service;

import com.clockin.dto.TimeEntryResponse;
import com.clockin.model.TimeEntry;
import com.clockin.repository.TimeEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TimeEntryService {
    
    @Autowired
    private TimeEntryRepository timeEntryRepository;
    
    public TimeEntryResponse clockIn(String firstName, String lastName) {
        // Check if employee is already clocked in
        Optional<TimeEntry> activeEntry = timeEntryRepository.findByFirstNameAndLastNameAndIsActiveTrue(firstName, lastName);
        if (activeEntry.isPresent()) {
            throw new RuntimeException("Employee is already clocked in");
        }
        
        TimeEntry timeEntry = new TimeEntry(firstName, lastName);
        TimeEntry savedEntry = timeEntryRepository.save(timeEntry);
        
        return convertToResponse(savedEntry);
    }
    
    public TimeEntryResponse clockOut(String firstName, String lastName) {
        Optional<TimeEntry> activeEntry = timeEntryRepository.findByFirstNameAndLastNameAndIsActiveTrue(firstName, lastName);
        if (activeEntry.isEmpty()) {
            throw new RuntimeException("Employee is not clocked in");
        }
        
        TimeEntry timeEntry = activeEntry.get();
        timeEntry.setClockOutTime(LocalDateTime.now());
        timeEntry.setIsActive(false);
        
        // Calculate total hours
        if (timeEntry.getClockInTime() != null && timeEntry.getClockOutTime() != null) {
            double hours = ChronoUnit.MINUTES.between(timeEntry.getClockInTime(), timeEntry.getClockOutTime()) / 60.0;
            timeEntry.setTotalHours(Math.round(hours * 100.0) / 100.0); // Round to 2 decimal places
        }
        
        TimeEntry savedEntry = timeEntryRepository.save(timeEntry);
        return convertToResponse(savedEntry);
    }
    
    public List<TimeEntryResponse> getEmployeeHistory(String firstName, String lastName) {
        List<TimeEntry> entries = timeEntryRepository.findByFirstNameAndLastNameOrderByClockInTimeDesc(firstName, lastName);
        return entries.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public TimeEntryResponse getCurrentStatus(String firstName, String lastName) {
        Optional<TimeEntry> activeEntry = timeEntryRepository.findByFirstNameAndLastNameAndIsActiveTrue(firstName, lastName);
        return activeEntry.map(this::convertToResponse).orElse(null);
    }
    
    public List<Map<String, Object>> getAllEmployeesData() {
        List<TimeEntry> allEntries = timeEntryRepository.findAll();
        
        // Group by employee
        Map<String, List<TimeEntry>> employeeGroups = allEntries.stream()
                .collect(Collectors.groupingBy(entry -> entry.getFirstName() + " " + entry.getLastName()));
        
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (Map.Entry<String, List<TimeEntry>> group : employeeGroups.entrySet()) {
            String employeeName = group.getKey();
            List<TimeEntry> entries = group.getValue();
            
            // Calculate statistics
            double totalHours = entries.stream()
                    .filter(entry -> entry.getTotalHours() != null)
                    .mapToDouble(TimeEntry::getTotalHours)
                    .sum();
            
            long totalEntries = entries.size();
            long activeEntries = entries.stream()
                    .filter(TimeEntry::getIsActive)
                    .count();
            
            // Get latest entry
            TimeEntry latestEntry = entries.stream()
                    .max(Comparator.comparing(TimeEntry::getClockInTime))
                    .orElse(null);
            
            Map<String, Object> employeeData = new HashMap<>();
            employeeData.put("employeeName", employeeName);
            employeeData.put("firstName", entries.get(0).getFirstName());
            employeeData.put("lastName", entries.get(0).getLastName());
            employeeData.put("totalHours", Math.round(totalHours * 100.0) / 100.0);
            employeeData.put("totalEntries", totalEntries);
            employeeData.put("activeEntries", activeEntries);
            employeeData.put("isCurrentlyActive", activeEntries > 0);
            employeeData.put("latestEntry", latestEntry != null ? convertToResponse(latestEntry) : null);
            employeeData.put("entries", entries.stream().map(this::convertToResponse).collect(Collectors.toList()));
            
            result.add(employeeData);
        }
        
        // Sort by employee name
        result.sort((a, b) -> ((String) a.get("employeeName")).compareTo((String) b.get("employeeName")));
        
        return result;
    }
    
    public Map<String, Object> getAdminSummary() {
        List<TimeEntry> allEntries = timeEntryRepository.findAll();
        
        long totalEmployees = allEntries.stream()
                .map(entry -> entry.getFirstName() + " " + entry.getLastName())
                .distinct()
                .count();
        
        long currentlyActive = allEntries.stream()
                .filter(TimeEntry::getIsActive)
                .count();
        
        double totalHours = allEntries.stream()
                .filter(entry -> entry.getTotalHours() != null)
                .mapToDouble(TimeEntry::getTotalHours)
                .sum();
        
        long totalEntries = allEntries.size();
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalEmployees", totalEmployees);
        summary.put("currentlyActive", currentlyActive);
        summary.put("totalHours", Math.round(totalHours * 100.0) / 100.0);
        summary.put("totalEntries", totalEntries);
        
        return summary;
    }
    
    public Map<String, Object> getEmployeeWeeklyData(String firstName, String lastName) {
        List<TimeEntry> employeeEntries = timeEntryRepository.findByFirstNameAndLastNameOrderByClockInTimeDesc(firstName, lastName);
        
        Map<String, Object> result = new HashMap<>();
        result.put("firstName", firstName);
        result.put("lastName", lastName);
        result.put("employeeName", firstName + " " + lastName);
        
        // Group entries by week
        Map<String, List<TimeEntry>> weeklyGroups = new HashMap<>();
        Map<String, Double> weeklyTotals = new HashMap<>();
        
        for (TimeEntry entry : employeeEntries) {
            if (entry.getClockInTime() != null) {
                String weekKey = getWeekKey(entry.getClockInTime());
                weeklyGroups.computeIfAbsent(weekKey, k -> new ArrayList<>()).add(entry);
                
                if (entry.getTotalHours() != null) {
                    weeklyTotals.merge(weekKey, entry.getTotalHours(), Double::sum);
                }
            }
        }
        
        // Convert to weekly data structure
        List<Map<String, Object>> weeklyData = new ArrayList<>();
        for (Map.Entry<String, List<TimeEntry>> weekEntry : weeklyGroups.entrySet()) {
            String weekKey = weekEntry.getKey();
            List<TimeEntry> weekEntries = weekEntry.getValue();
            
            Map<String, Object> weekData = new HashMap<>();
            weekData.put("weekKey", weekKey);
            weekData.put("weekLabel", getWeekLabel(weekKey));
            weekData.put("totalHours", Math.round(weeklyTotals.getOrDefault(weekKey, 0.0) * 100.0) / 100.0);
            weekData.put("entryCount", weekEntries.size());
            
            // Group by weekday
            Map<String, List<TimeEntry>> weekdayGroups = new HashMap<>();
            for (TimeEntry entry : weekEntries) {
                String weekday = getWeekday(entry.getClockInTime());
                weekdayGroups.computeIfAbsent(weekday, k -> new ArrayList<>()).add(entry);
            }
            
            // Convert weekday groups to response format
            List<Map<String, Object>> weekdayData = new ArrayList<>();
            for (Map.Entry<String, List<TimeEntry>> weekdayEntry : weekdayGroups.entrySet()) {
                String weekday = weekdayEntry.getKey();
                List<TimeEntry> dayEntries = weekdayEntry.getValue();
                
                double dayTotalHours = dayEntries.stream()
                        .filter(entry -> entry.getTotalHours() != null)
                        .mapToDouble(TimeEntry::getTotalHours)
                        .sum();
                
                Map<String, Object> dayData = new HashMap<>();
                dayData.put("weekday", weekday);
                dayData.put("totalHours", Math.round(dayTotalHours * 100.0) / 100.0);
                dayData.put("entries", dayEntries.stream().map(this::convertToResponse).collect(Collectors.toList()));
                
                weekdayData.add(dayData);
            }
            
            // Sort by weekday (Monday to Sunday)
            weekdayData.sort((a, b) -> getWeekdayOrder((String) a.get("weekday")) - getWeekdayOrder((String) b.get("weekday")));
            
            weekData.put("weekdays", weekdayData);
            weeklyData.add(weekData);
        }
        
        // Sort by week (most recent first)
        weeklyData.sort((a, b) -> ((String) b.get("weekKey")).compareTo((String) a.get("weekKey")));
        
        result.put("weeklyData", weeklyData);
        
        // Calculate overall totals
        double totalHours = employeeEntries.stream()
                .filter(entry -> entry.getTotalHours() != null)
                .mapToDouble(TimeEntry::getTotalHours)
                .sum();
        
        result.put("totalHours", Math.round(totalHours * 100.0) / 100.0);
        result.put("totalEntries", employeeEntries.size());
        
        return result;
    }
    
    private String getWeekKey(LocalDateTime dateTime) {
        // Get the start of the week (Monday)
        LocalDateTime startOfWeek = dateTime.toLocalDate()
                .atStartOfDay()
                .with(java.time.DayOfWeek.MONDAY);
        
        return startOfWeek.format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }
    
    private String getWeekLabel(String weekKey) {
        LocalDateTime startOfWeek = LocalDateTime.parse(weekKey + "T00:00:00");
        LocalDateTime endOfWeek = startOfWeek.plusDays(6);
        
        return startOfWeek.format(java.time.format.DateTimeFormatter.ofPattern("MMM dd")) + 
               " - " + 
               endOfWeek.format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy"));
    }
    
    private String getWeekday(LocalDateTime dateTime) {
        return dateTime.getDayOfWeek().getDisplayName(java.time.format.TextStyle.FULL, java.util.Locale.ENGLISH);
    }
    
    private int getWeekdayOrder(String weekday) {
        Map<String, Integer> weekdayOrder = Map.of(
            "Monday", 1,
            "Tuesday", 2,
            "Wednesday", 3,
            "Thursday", 4,
            "Friday", 5,
            "Saturday", 6,
            "Sunday", 7
        );
        return weekdayOrder.getOrDefault(weekday, 0);
    }
    
    private TimeEntryResponse convertToResponse(TimeEntry timeEntry) {
        return new TimeEntryResponse(
                timeEntry.getId(),
                timeEntry.getFirstName(),
                timeEntry.getLastName(),
                timeEntry.getClockInTime(),
                timeEntry.getClockOutTime(),
                timeEntry.getTotalHours(),
                timeEntry.getIsActive()
        );
    }
} 