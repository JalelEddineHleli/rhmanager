package com.example.User_Service.repository.REPORH;

import com.example.User_Service.entity.rhentities.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
}
