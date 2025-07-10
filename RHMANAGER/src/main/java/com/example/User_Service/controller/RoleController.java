package com.example.User_Service.controller;

import com.example.User_Service.dto.RoleDto;
import com.example.User_Service.entity.AppRole;
import com.example.User_Service.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequestMapping("/roleapi")
@RestController
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;
    @PostMapping
    public void addrole(@RequestBody RoleDto role) {
        roleService.add(role);
    }
    @DeleteMapping("/delete/{id}")
    public void deleterole(@PathVariable String id) {
        roleService.deleteRoleById(id);
    }
    @GetMapping
    public List<AppRole> getAllRoles() {
        return roleService.getVisibleRoles();
    }
    @GetMapping("/{id}")
    public RoleDto
    getRoleById(@PathVariable  String id) {
        return roleService.getRoleById(id);

    }

}
