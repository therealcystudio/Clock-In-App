package com.clockin.repository;

import com.clockin.model.TimeEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {
    
    List<TimeEntry> findByFirstNameAndLastNameOrderByClockInTimeDesc(String firstName, String lastName);
    
    Optional<TimeEntry> findByFirstNameAndLastNameAndIsActiveTrue(String firstName, String lastName);
    
    @Query("SELECT t FROM TimeEntry t WHERE t.firstName = :firstName AND t.lastName = :lastName AND t.clockInTime >= :startDate ORDER BY t.clockInTime DESC")
    List<TimeEntry> findByEmployeeAndDateRange(@Param("firstName") String firstName, 
                                              @Param("lastName") String lastName, 
                                              @Param("startDate") java.time.LocalDateTime startDate);
} 