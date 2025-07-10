package com.example.User_Service.controller;

import com.example.User_Service.dto.ChangePasswordRequest;
import com.example.User_Service.dto.RoleDto;
import com.example.User_Service.dto.UserDto;
import com.example.User_Service.entity.AppRole;
import com.example.User_Service.entity.AppUser;
import com.example.User_Service.security.JwtService;
import com.example.User_Service.service.AuthService;
import com.example.User_Service.service.RoleService;
import com.example.User_Service.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/userapi/this")
public class AuthenticationController {
    private  final AuthService authservice;
    private final JwtService jwtService;
    private final RoleService roleService;
    private final UserService userService;

    @GetMapping
    public List<AppRole> getAllRoles() {
        return roleService.getAllRoles();
    }
    @GetMapping("/user/profile")
    public UserDto getUserProfile() {
        return userService.getuserprofile();
    }
/*    @GetMapping("/users")
    public Page<UserDto> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.getAllUsers(pageable);
    }*/
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
@GetMapping("/user/getall")
public Page<UserDto> getAllUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    return userService.getAllUsers(pageable);

}
@PostMapping("/crmuser")
public void createCRMUSER(@RequestBody  AppUser user) {
    userService.createCRMUSER(user);
}

        @PostMapping( "/register")
        public String registeruser
                (@RequestBody RegisterRequest registerRequest) throws MessagingException {
            return authservice.register(registerRequest);

        }
    @PostMapping("/login")
    public  String  loginruser
            (@RequestBody AuthenticationRequest authenticationRequest) {
        return authservice.authenticate(authenticationRequest) ;

    }
    @PostMapping("/forgot-password")
    public ResponseEntity<String> demanderReinitialisation(@RequestBody Map<String, String> request) throws MessagingException {
        String email = request.get("email");
        authservice.demanderReinitialisation(email);
        return ResponseEntity.ok("Un email a été envoyé.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> reinitialiserMotDePasse( @RequestBody ChangePasswordRequest request) {
        authservice.reinitialiserMotDePasse(request.getToken(), request.getNouveauMotDePasse());
        return ResponseEntity.ok("Votre mot de passe a été réinitialisé avec succès.");
    }
    @PutMapping("/change-password")
    public ResponseEntity<String> changerMotDePasse(@Valid @RequestBody ChangePasswordRequest request) {
        authservice.changerMotDePasse(request.getAncienMotDePasse(), request.getNouveauMotDePasse());
        return ResponseEntity.ok("Mot de passe mis à jour avec succès.");
    }
/*  @PostMapping("/activate")
    public ResponseEntity<String> activateAccount(@RequestParam String token) throws MessagingException {
        authservice.activateAccount(token);
        return ResponseEntity.ok("Account activated successfully.");
    }*/
/*@PostMapping("/activate")
public ResponseEntity<String> activateAccount(
        @RequestParam String token,
        HttpServletRequest request
) throws MessagingException {
    String tenantId = request.getHeader("X-Tenant-ID");
    if (tenantId == null || tenantId.isBlank()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Tenant ID manquant dans le header");
    }

    authservice.activateAccount(token, request);
    return ResponseEntity.ok("Compte activé avec succès.");
}*/

  /*  @PostMapping("/activate-user")
    public ResponseEntity<String> activateUser(@RequestParam String email) throws MessagingException {
        authservice.activateAccount(email);
        return ResponseEntity.ok("Compte utilisateur activé avec succès");
    }*/


}
