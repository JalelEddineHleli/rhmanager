package com.example.User_Service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.TenantId;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.aspectj.weaver.tools.cache.SimpleCacheFactory.enabled;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppUser  implements UserDetails {
    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String uuid;



    @Column(unique=true)
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    private boolean enabled ;
/*    @Column(columnDefinition = "jsonb")
    private String customAttributes;*/
 /*   @ManyToOne
    private Tenant tenant;*/
   /* @TenantId*/

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @ManyToMany(fetch = FetchType.EAGER)
    private List<AppRole> roles;
    @OneToMany(mappedBy = "user")
    private List<Token> tokens;
    @Override
    public boolean isEnabled() {
        return this.enabled;
    }



    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getRole()))
                .collect(Collectors.toList());
    }
    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @PrePersist
    protected void onCreate() {
        if (this.uuid == null) {
            this.uuid = UUIDGenerator.generateUUIDForEntity("User");
        }
        createdAt = LocalDateTime.now();
    }
}
