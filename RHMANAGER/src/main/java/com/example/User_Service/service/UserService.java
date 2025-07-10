package com.example.User_Service.service;

import com.example.User_Service.dto.RoleDto;
import com.example.User_Service.dto.UserDto;
import com.example.User_Service.entity.AppRole;
import com.example.User_Service.entity.AppUser;
import com.example.User_Service.mapper.RoleMapper;
import com.example.User_Service.mapper.UserMapper;
import com.example.User_Service.repository.RoleRepository;
import com.example.User_Service.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor

public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    public Page<UserDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(UserMapper.INSTANCE::toDTO);
    }
    public Page<UserDto> searchUsers(String search, Pageable pageable) {
        return userRepository.findByEmail(search,pageable)
                .map(UserMapper.INSTANCE::toDTO);
    }
    public Page<UserDto> searchAllusers(
            String search,
            String email,
            LocalDateTime startdate,
            LocalDateTime enddate,
            Pageable pageable) {


        return userRepository.findByCombinedNameOrEmailAndDateRange(
                search,
                email,
                startdate,
                enddate,
                pageable
        ).map(UserMapper.INSTANCE::toDTO);
    }
    public Page<UserDto> searchAllUsers(
            String search,
            String email,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Boolean enabled,
            Pageable pageable) {


        return userRepository.searchUsersByCriteria(
                search,
                email,
                startDate,
                endDate,
                enabled,
                pageable
        ).map(UserMapper.INSTANCE::toDTO);
    }


 /*   public List<AppUser> getAllUsers() {
        return userRepository.findAll();


    }*/

    public void createUser(UserDto user) {
AppUser appUser = UserMapper.INSTANCE.toEntity(user);
        userRepository.save(appUser);
    }    public void createCRMUSER(AppUser user) {
        AppRole r= roleRepository.findByRole(user.getRoles().get(0).getRole());
        user.setRoles(Arrays.asList(r));
        userRepository.save(user);
    }


    @Transactional
    public void deleteUser(String id) {
        userRepository.deleteByUuid(id);

    }

    public UserDto getUserById(String id) {

        return UserMapper.INSTANCE.toDTO(userRepository.findByUuid(id));
    }


    public List<RoleDto> getRolesByUserId(String userId) {
        return userRepository.findByUuid(userId)
                .getRoles()
                .stream()
                .map(RoleMapper.INSTANCE::toDTO)
                .toList();
    }
    @jakarta.transaction.Transactional
    public void desaactivateAccount(String uuid)  throws MessagingException {
        AppUser userOptional = userRepository.findByUuid(uuid);


        AppUser user = userOptional;

        if (!user.isEnabled()) {
            throw new IllegalStateException("Le compte est déjà désactivé.");
        }

        user.setEnabled(false);
        userRepository.save(user);

    }

    public UserDto getuserprofile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        AppUser user=userRepository.findByEmail(email);
        return UserDto.builder()
                .uuid(user.getUuid())
                .phone(user.getPhone())
                .address(user.getAddress())
                .lastName(user.getLastName())
                .firstName(user.getFirstName())
                .email(email)
                .enabled(user.isEnabled())
                .createdAt(LocalDate.from(user.getCreatedAt()))
                .build();
    }
    @Transactional
    public AppUser updateUser(String email, AppUser updateUser) {
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("Email ne peut pas être null ou vide");
        }

        AppUser existingUser = userRepository.findByEmail(email);
        if (existingUser == null) {
            throw new RuntimeException("Utilisateur non trouvé avec l'email : " + email);
        }

        // Mise à jour des champs
        if (updateUser.getFirstName() != null) {
            existingUser.setFirstName(updateUser.getFirstName());
        }
        if (updateUser.getLastName() != null) {
            existingUser.setLastName(updateUser.getLastName());
        }
        if (updateUser.getAddress() != null) {
            existingUser.setAddress(updateUser.getAddress());
        }
        if (updateUser.getPhone() != null) {
            existingUser.setPhone(updateUser.getPhone());
        }

        return userRepository.save(existingUser);
    }

    public List<UserDto> autocompleteUsersByNomPrenom(String query) {
        return userRepository.findByFirstNameOrLastNameContainingIgnoreCase(query).stream()
                .map(UserMapper.INSTANCE::toDTO).toList();
    }
    public List<UserDto> autocompleteUsersByEmail(String query) {
        return userRepository.findByEmailContainingIgnoreCase(query)
                .stream()
                .map(UserMapper.INSTANCE::toDTO)
                .toList();
    }
    public List<UserDto> autocompleteUsers(String query) {
        List<AppUser> usersByName = userRepository.findByFirstNameOrLastNameContainingIgnoreCase(query);
        List<AppUser> usersByEmail = userRepository.findByEmailContainingIgnoreCase(query);

        // Combine and remove duplicates (based on UUID as it's unique)
        return usersByName.stream()
                .distinct()
                .map(UserMapper.INSTANCE::toDTO)
                .collect(Collectors.toList());
    }
    public List<UserDto> autocompleteUsersemail(String query) {

        List<AppUser> usersByEmail = userRepository.findByEmailContainingIgnoreCase(query);


        return usersByEmail.stream()
                .distinct()
                .map(UserMapper.INSTANCE::toDTO)
                .collect(Collectors.toList());
    }

    ////////////////////////////////////////

 /*   private final entityconfigrepository entityConfigRepository;
    private final ObjectMapper objectMapper;
    private final DataSource dataSource;
    public AppUser saveAppUser(AppUser user, String tenantId) throws Exception {
        EntityConfig config = entityConfigRepository.findByTenantIdAndEntityName(tenantId, "AppUser");
        if (config == null) {
            throw new RuntimeException("Config not found for tenant " + tenantId);
        }

        Set<String> visibleAttrs = config.getVisibleAttributes();

        // 🔧 Créer le schéma et la table dynamiquement si besoin
        createSchemaAndAppUserTableIfNeeded(tenantId, visibleAttrs);

        Map<String, Object> customAttrs = new HashMap<>();

        // Validation des règles
        String validationRulesJson = config.getValidationRules();
        Map<String, String> validationRules = new HashMap<>();
        if (validationRulesJson != null && !validationRulesJson.isEmpty()) {
            validationRules = objectMapper.readValue(validationRulesJson, new TypeReference<Map<String, String>>() {});
        }

        for (Map.Entry<String, String> entry : validationRules.entrySet()) {
            String attr = entry.getKey();
            String rule = entry.getValue();

            if ("required".equalsIgnoreCase(rule)) {
                if (!customAttrs.containsKey(attr) || customAttrs.get(attr) == null || customAttrs.get(attr).toString().isEmpty()) {
                    throw new RuntimeException("Attribut obligatoire manquant ou vide : " + attr);
                }
            }
            if ("numeric".equalsIgnoreCase(rule)) {
                if (customAttrs.containsKey(attr)) {
                    try {
                        Double.parseDouble(customAttrs.get(attr).toString());
                    } catch (NumberFormatException e) {
                        throw new RuntimeException("Attribut doit être numérique : " + attr);
                    }
                }
            }
        }

        return userRepository.save(user);
    }


    public AppUser getAppUser(Long id) {
        return userRepository.findById(id).orElse(null);
    }


    private void createSchemaAndAppUserTableIfNeeded(String tenantId, Set<String> visibleAttrs) throws SQLException {
        String schema = "tenant_" + tenantId;

        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {

            // 1. Créer le schéma s'il n'existe pas
            stmt.execute("CREATE SCHEMA IF NOT EXISTS " + schema);

            // 2. Vérifier si la table appuser existe
            ResultSet rs = stmt.executeQuery(
                    "SELECT table_name FROM information_schema.tables WHERE table_schema = '" + schema + "' AND table_name = 'appuser'"
            );

            if (!rs.next()) {
                // 3. Créer la table appuser dynamiquement
                StringBuilder createTable = new StringBuilder("CREATE TABLE " + schema + ".appuser (id SERIAL PRIMARY KEY");

                for (String attr : visibleAttrs) {
                    createTable.append(", ").append(attr.toLowerCase()).append(" TEXT");
                }

                createTable.append(")");
                stmt.execute(createTable.toString());
            }
        }
    }
*/


}