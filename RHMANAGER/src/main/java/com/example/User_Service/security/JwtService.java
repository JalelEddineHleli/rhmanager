package com.example.User_Service.security;

import com.example.User_Service.entity.AppUser;
import com.example.User_Service.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service

public class JwtService {
    private static final String SECRET_KEY = "d922c04b17b7646e630363f45b65eeb83aad518e697a14ca6c73cefb049e9866e4a3af0651f97117fee4df99ce2555c65b978550b031990ab9bdf1d5dc31629088a338cfbd85ba9a0223de8102e8a63bf04a6364455771813535910e30673b55521a98a958df97ec0c5112aaa454b95de6e498d19a7a0f30b26e74fd06ebb01b983682a939ca743c10238daaaa05ad3b067b32d1aa36476175ad08bb505f6f4b4fa3b94df9d54c36498c61fbaf6f09c08a4773993c64725131a98881e0c80e5674ced6b5b70c5497386e7f9ffff5ea8d597dd9df1370eff8d3b21625f63f682b48b6624d3fb440e1e8e228d9c7247462c032134154e8ba869179928c5728e64b";
    private final UserRepository userRepository;

    public JwtService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public String extractusername(String token) {
        return extractcompleteclaims(token).getSubject() ;
    }







    private Claims extractcompleteclaims (String jwt){
        return Jwts.parser()
                .setSigningKey(getSigningKey())
                .parseClaimsJws(jwt)
                .getBody();
    }


/*private <T> T extractclaim(String jwt, Function<Claims,T> claimresolver ){
        final Claims claims = extractcompleteclaims(jwt);
        return claimresolver.apply(claims);
}*/



    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }


    public String generatetoken(
            UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<String, Object>();
        if (userDetails instanceof AppUser appUser) {


        }
        if (userDetails instanceof AppUser appUser) {
            claims.put("uuid", appUser.getUuid());
        }
        claims.put("roles", userDetails.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .collect(Collectors.toList())
        );


        return Jwts.builder()
                .addClaims(claims)
                //   .setClaims(null)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000*60*60*60 ))
                .signWith(SignatureAlgorithm.HS512, getSigningKey())
                .compact();
    }



    public Boolean tokenisvalid(String token , UserDetails userDetails) {
        final String username = extractusername(token);

        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

public void validatetoken(String token ) {
        Jwts.parser().setSigningKey(getSigningKey()).parseClaimsJws(token);
}


    public Date extractexpirationdate(String token) {
        return extractcompleteclaims(token).getExpiration() ;
    }

    private boolean isTokenExpired(String token) {
        return extractexpirationdate(token).before(new Date());
    }
}
