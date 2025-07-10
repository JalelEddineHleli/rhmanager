package com.example.User_Service.repository;

import com.example.User_Service.entity.AppUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository

public interface UserRepository extends JpaRepository<AppUser, Long> {
    AppUser findByEmail(String email);
    AppUser findByUuid(String uuid);
    void deleteByUuid(String uuid);
    Page<AppUser> findAll(Pageable pageable);
    Page<AppUser> findByEmailContaining(String email, Pageable pageable);
@Query("SELECT u FROM AppUser u WHERE u.email LIKE %:email%")
    Page<AppUser> findByEmail(@Param("email") String email, Pageable pageable);
   /* @Query("SELECT p FROM AppUser p WHERE " +

            "(:firstName IS NULL OR :firstName = '' OR LOWER(p.firstName) LIKE LOWER(CONCAT('%',:firstName,'%' ))) AND " +
            "(:lastName IS NULL OR :lastName = '' OR LOWER(p.lastName) LIKE LOWER(CONCAT('%',:lastName,'%' ))) AND " +
            "(:email IS NULL OR :email = '' OR LOWER(p.email) LIKE LOWER(CONCAT('%',:email,'%' ))) AND " +
            "(cast(:dateDebut as timestamp) IS NULL OR p.createdAt >= :dateDebut) AND " +
            "(cast(:dateFin as timestamp) IS NULL OR p.createdAt <= :dateFin)")
    Page<AppUser> findByFirstNameAndLastNameAndEmailAndDateRange(
            @Param("firstName") String firstName,
            @Param("lastName") String lastName,
            @Param("email") String email,
            @Param("dateDebut") LocalDateTime dateDebut,
            @Param("dateFin") LocalDateTime dateFin,
            Pageable pageable);*/
   @Query("SELECT p FROM AppUser p WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(p.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(CONCAT(p.firstName, ' ', p.lastName)) LIKE LOWER(CONCAT('%', :search, '%'))" +
           ") AND " +
           "(:email IS NULL OR :email = '' OR LOWER(p.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND " +
           "(cast(:dateDebut as timestamp) IS NULL OR p.createdAt >= :dateDebut) AND " +
           "(cast(:dateFin as timestamp) IS NULL OR p.createdAt <= :dateFin)")
   Page<AppUser> findByCombinedNameOrEmailAndDateRange(
           @Param("search") String search,
           @Param("email") String email,
           @Param("dateDebut") LocalDateTime dateDebut,
           @Param("dateFin") LocalDateTime dateFin,
           Pageable pageable);
    @Query("SELECT p FROM AppUser p WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(p.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(CONCAT(p.firstName, ' ', p.lastName)) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:email IS NULL OR :email = '' OR LOWER(p.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND " +
            "(cast(:dateDebut as timestamp) IS NULL OR p.createdAt >= :dateDebut) AND " +
            "(cast(:dateFin as timestamp) IS NULL OR p.createdAt <= :dateFin) AND " +
            "(:enabled IS NULL OR p.enabled = :enabled)")
    Page<AppUser> searchUsersByCriteria(
            @Param("search") String search,
            @Param("email") String email,
            @Param("dateDebut") LocalDateTime dateDebut,
            @Param("dateFin") LocalDateTime dateFin,
            @Param("enabled") Boolean enabled,
            Pageable pageable);

    /*  @Transactional
    @Modifying
    @Query("update AppUser u set  u.password= :password where u.email = :email")
    void updatePassword(String email, String password);*/
  @Query("SELECT u FROM AppUser u WHERE " +
          "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
          "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%'))")
  List<AppUser> findByFirstNameOrLastNameContainingIgnoreCase(@Param("query") String query);

    @Query("SELECT u FROM AppUser u WHERE LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<AppUser> findByEmailContainingIgnoreCase(@Param("query") String query);



}
