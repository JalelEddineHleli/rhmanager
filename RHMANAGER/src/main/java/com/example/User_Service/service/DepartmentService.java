package com.example.User_Service.service;


import com.example.User_Service.entity.rhentities.Department;
import com.example.User_Service.repository.REPORH.DepartmentRepository;
import com.example.User_Service.repository.REPORH.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    public Page<Department> getAllDepartments(Pageable pageable) {
        return departmentRepository.findAll(pageable);
    }

    public Department createDepartment(Department department) {
        department.setDepartmentHead(employeeRepository.findById(department.getDepartmentHead().getId()).get());
        return departmentRepository.save(department);
    }

    public Department getById(Long id) {
        return departmentRepository.findById(id).orElse(null);
    }

    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }
}

