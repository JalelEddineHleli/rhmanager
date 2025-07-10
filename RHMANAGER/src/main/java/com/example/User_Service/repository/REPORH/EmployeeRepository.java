package com.example.User_Service.repository.REPORH;


import com.example.User_Service.entity.rhentities.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Page<Employee> findByDepartment(String department, Pageable pageable);
    Page<Employee> findByManager_Id(Long managerId, Pageable pageable);
    Page<Employee> findByActiveTrue(Pageable pageable);
    @Query("SELECT DISTINCT e FROM Employee e WHERE e.id IN (SELECT em.manager.id FROM Employee em WHERE em.manager IS NOT NULL)")
    List<Employee> findManagers();
    List<Employee> findByManagerIsNull();


    // Alternative avec relation bidirectionnelle si vous l'avez définie
    // List<Employee> findBySubordinatesIsNotEmpty();

}

