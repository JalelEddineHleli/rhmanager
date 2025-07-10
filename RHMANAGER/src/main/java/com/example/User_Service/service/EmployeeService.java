package com.example.User_Service.service;

import com.example.User_Service.entity.rhentities.Employee;
import com.example.User_Service.repository.REPORH.DepartmentRepository;
import com.example.User_Service.repository.REPORH.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;


    public Page<Employee> getAllEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable);
    }
    public void deleteEmployee(Long id) {
        // Option 1: Vérifier que l'employé existe avant suppression
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id " + id));
        employeeRepository.delete(employee);
    }

    public Page<Employee> getEmployeesByManager(Long managerId, Pageable pageable) {
        return employeeRepository.findByManager_Id(managerId, pageable);
    }

    public Page<Employee> getByDepartment(String department, Pageable pageable) {
        return employeeRepository.findByDepartment(department, pageable);
    }
    public List<Employee> getAllManagers() {
        // Solution 1: Si vous avez un champ spécifique pour identifier les managers
        // return employeeRepository.findByIsManagerTrue();

        // Solution 2: Si un manager est simplement un employé qui a des subordonnés
        return employeeRepository.findByManagerIsNull   ();
    }
    public Page<Employee> getActiveEmployees(Pageable pageable) {
        return employeeRepository.findByActiveTrue(pageable);

    }

    public Employee createEmployee(Employee employee) {
        // Vous pouvez ajouter ici une logique de validation si nécessaire
        employee.setDepartment(departmentRepository.findById(employee.getDepartment().getId()).orElse(null));
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        // Mise à jour des champs
        employee.setFirstName(employeeDetails.getFirstName());
        employee.setLastName(employeeDetails.getLastName());
        employee.setBirthDate(employeeDetails.getBirthDate());
        // ... mettre à jour tous les autres champs nécessaires ...

        return employeeRepository.save(employee);
    }
}
