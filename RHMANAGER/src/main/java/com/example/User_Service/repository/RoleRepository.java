package com.example.User_Service.repository;

import com.example.User_Service.entity.AppRole;
import com.example.User_Service.entity.AppUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository  extends JpaRepository<AppRole, Long> {
    AppRole findByUuid(String uuid);
    void deleteByUuid(String uuid);
    Page<AppRole> findAll(Pageable pageable);
    Page<AppRole> findByRoleContaining(String role, Pageable pageable);
  //  Optional<AppRole> findByRole(String role);
    AppRole findByRole(String role);

}
