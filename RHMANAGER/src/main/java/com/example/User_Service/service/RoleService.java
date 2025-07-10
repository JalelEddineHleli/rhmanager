package com.example.User_Service.service;

import com.example.User_Service.dto.RoleDto;
import com.example.User_Service.entity.AppRole;
import com.example.User_Service.mapper.RoleMapper;
import com.example.User_Service.repository.RoleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service


public class RoleService {
    private final RoleRepository roleRepository;

    private  final RoleMapper roleMapper;

    public RoleService(RoleMapper roleMapper, RoleRepository roleRepository) {
        this.roleMapper = roleMapper;
        this.roleRepository = roleRepository;
    }


    public void add(RoleDto role) {
        AppRole appRole = roleMapper.toEntity(role);
        roleRepository.save(appRole);

    }
 /*   public List<RoleDto> getAllRoles() {
        List<AppRole> roles = roleRepository.findAll();
        return roles.stream().map(role->roleMapper.toDTO(role))
                .collect(Collectors.toList());
    }*/
 public List<AppRole> getAllRoles() {

     return roleRepository.findAll();

 }
    public List<AppRole> getVisibleRoles() {
        return roleRepository.findAll()
                .stream()
                .filter(role -> !AppRole.RoleConstants.ADMIN.equals(role.getRole()))
                .collect(Collectors.toList());
    }

    /* public List<RoleDto> getAllRoles() {

     return roleRepository.findAll().stream().map(RoleMapper.INSTANCE::toDTO).collect(Collectors.toList());

 }*/
    public RoleDto getRoleById(String id) {

        AppRole approle  = roleRepository.findByUuid(id);
        return roleMapper.toDTO(approle);
    }
    @Transactional
    public void deleteRoleById(String id) {
        roleRepository.deleteByUuid(id);
    }
    public AppRole createRole(AppRole role) {
        if (AppRole.RoleConstants.ADMIN.equals(role.getRole())) {
            throw new IllegalArgumentException("Cannot create or modify SUPER_ADMIN role");
        }
        return roleRepository.save(role);
    }

}
