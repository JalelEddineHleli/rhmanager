package com.example.User_Service.controller;

import com.example.User_Service.entity.rhentities.Employee;
import com.example.User_Service.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;
    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        Employee createdEmployee = employeeService.createEmployee(employee);
        return ResponseEntity.ok(createdEmployee);
    }
    @GetMapping("/managers")
    public ResponseEntity<List<Employee>> getAllManagers() {
        List<Employee> managers = employeeService.getAllManagers();
        return ResponseEntity.ok(managers);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable Long id,
            @RequestBody Employee employee) {
        Employee updatedEmployee = employeeService.updateEmployee(id, employee);
        return ResponseEntity.ok(updatedEmployee);
    }
    @GetMapping
    public Page<Employee> getAll(@PageableDefault(size = 10, sort = "lastName") Pageable pageable) {
        return employeeService.getAllEmployees(pageable);
    }

    @GetMapping("/manager/{managerId}")
    public Page<Employee> getByManager(@PathVariable Long managerId, Pageable pageable) {
        return employeeService.getEmployeesByManager(managerId, pageable);
    }

    @GetMapping("/department/{department}")
    public Page<Employee> getByDepartment(@PathVariable String department, Pageable pageable) {
        return employeeService.getByDepartment(department, pageable);
    }

    @GetMapping("/active")
    public Page<Employee> getActive(Pageable pageable) {
        return employeeService.getActiveEmployees(pageable);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();  // Retourne 204 No Content
    }

}
