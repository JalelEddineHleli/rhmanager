package com.example.User_Service.repository;


import com.example.User_Service.entity.AppUser;
import com.example.User_Service.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    Optional<Token> findByToken(String token);
    @Query( "select t from Token t inner join AppUser u on t.user.id = u.id where u.id = :userId and (t.expired =false or t.revoked=false) ")
    List<Token> findallvalidtokenByUser(Long userId);
    @Modifying
    @Query("DELETE FROM Token t WHERE t.user = :user")
    void deleteByUser(@Param("user") AppUser user);

    @Modifying
    @Query("DELETE FROM Token t WHERE t.expirationTime < :now")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);
}
