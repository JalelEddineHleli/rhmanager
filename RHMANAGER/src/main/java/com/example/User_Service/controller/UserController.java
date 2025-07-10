package com.example.User_Service.controller;

import com.example.User_Service.dto.RoleDto;
import com.example.User_Service.dto.UserDto;
import com.example.User_Service.entity.AppRole;
import com.example.User_Service.entity.AppUser;
import com.example.User_Service.security.JwtService;
import com.example.User_Service.service.AuthService;
import com.example.User_Service.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/*
@AllArgsConstructor*/
@RequestMapping("/userapi")
@RestController
@RequiredArgsConstructor
public class UserController {
    private  final AuthService authservice;
   @Autowired
    private  UserService userService;
   private JwtService jwtService;
    @PostMapping("/user/create")
    public void createusers(@RequestBody  UserDto user) {
        userService.createUser(user);
    }


    @GetMapping("/user/search")
    public Page<UserDto> getUsers(String search,
                                   @RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.searchUsers( search,pageable);
    }
    @GetMapping("/user/getall")
    public Page<UserDto> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.getAllUsers(pageable);

    }
    @GetMapping("/user/users/{userId}/roles")
    public List<RoleDto> getUserRoles(@PathVariable String userId) {
        return userService.getRolesByUserId(userId);
    }
    @DeleteMapping("/user/delete/{id}")
    public void deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
    }
    @GetMapping("/user/{id}")
    public UserDto getUserById(@PathVariable String id) {
       return userService.getUserById(id);

    }
    @PostMapping("/user/activate")
    public ResponseEntity<String> activateAccount(
            @RequestParam String token,
            HttpServletRequest request
    ) throws MessagingException {
        String tenantId = request.getHeader("X-Tenant-ID");
       /* if (tenantId == null || tenantId.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Tenant ID manquant dans le header");
        }*/

        authservice.activateAccount(token, request);
        return ResponseEntity.ok("Compte activé avec succès.");
    }
    @PostMapping("/user/desactivate/{uuid}")
    public ResponseEntity<String> desactivateAccount(@PathVariable String uuid) throws MessagingException {
        userService.desaactivateAccount(uuid);
        return ResponseEntity.ok("Account Desactivated successfully.");
    }
    @PutMapping("/user/updateuser")
    public ResponseEntity<AppUser> updateuser(
            @RequestParam String email,
            @RequestBody AppUser userUpdate) {

        // Validation de l'email
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            AppUser updatedUser = userService.updateUser(email, userUpdate);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/user/profile")
    public UserDto getUserProfile() {
       return userService.getuserprofile();
    }
    @GetMapping("/user/searchall")
    public Page<UserDto> searchAllusers(
            @RequestParam(required = false) String search,

            @RequestParam(required = false) String email,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startdate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime enddate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return userService.searchAllusers( search,email, startdate, enddate, pageable);
    }
    @GetMapping("/users/search")
    public Page<UserDto> searchAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startdate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime enddate,
            @RequestParam(required = false) Boolean enabled,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return userService.searchAllUsers(search, email, startdate, enddate, enabled, pageable);
    }


    /*  @GetMapping("/user/autocomplete")
    public ResponseEntity<List<UserDto>> autocompleteUsers(@RequestParam("query") String query) {
        List<UserDto> results = userService.autocompleteUsersByNomPrenom(query);
        return ResponseEntity.ok(results);
    }*/
    @GetMapping("/user/autocomplete/email")
    public ResponseEntity<List<UserDto>> autocompleteUsersByEmail(@RequestParam String query) {
        List<UserDto> suggestions = userService.autocompleteUsersByEmail(query);
        return ResponseEntity.ok(suggestions);
    }
    @GetMapping("/user/autocomplete")
    public ResponseEntity<List<UserDto>> autocompleteUsers(@RequestParam String query) {
        List<UserDto> suggestions = userService.autocompleteUsers(query);
        return ResponseEntity.ok(suggestions);
    }
    @GetMapping("/user/autocompletemail")
    public ResponseEntity<List<UserDto>> autocompleteUsersemail(@RequestParam String query) {
        List<UserDto> suggestions = userService.autocompleteUsersemail(query);
        return ResponseEntity.ok(suggestions);
    }
/*    @PostMapping("/tenantexemple/{tenantId}")
    public AppUser saveUser(@RequestBody AppUser user, @PathVariable String tenantId) throws Exception {
        return userService.saveAppUser(user, tenantId);
    }

    @GetMapping("/tenantexemple/{tenant}/{id}")
    public AppUser getUser(@PathVariable String tenant, @PathVariable Long id) {
        TenantContext.setCurrentTenant(tenant);
        try {
            return userService.getAppUser(id);
        } finally {
            TenantContext.clear();
        }
    }*/


    @PostMapping("/user/ajouteruserparadmin")
    public void ajouteruserparadmin(@RequestBody AppUser user) throws MessagingException {
        authservice.createUserparadmin(user);
    }

}
