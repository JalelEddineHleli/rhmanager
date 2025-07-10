package com.example.User_Service.service;

import com.example.User_Service.controller.AuthenticationRequest;
import com.example.User_Service.controller.RegisterRequest;
import com.example.User_Service.dto.RoleDto;
import com.example.User_Service.entity.*;
import com.example.User_Service.repository.RoleRepository;
import com.example.User_Service.repository.TokenRepository;
import com.example.User_Service.repository.UserRepository;
import com.example.User_Service.security.JwtService;
import com.example.User_Service.service.email.EmailService;
import com.example.User_Service.service.email.EmailTemplateName;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    private final EmailService emailService;
    private final TokenRepository tokenRepository;
    private final UserRepository appuserrepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userrepo;
    private final JwtService jwtservice;
    private final RoleRepository roleRepository;

    @Value("${application.mailing.frontend.reset-url}")
    private  String resetUrl;
    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;
 /*   public String register
            (RegisterRequest registerRequest) {

        var user = AppUser.builder()
                .uuid(registerRequest.getUuid())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .phone(registerRequest.getPhone())
                .lastName(registerRequest.getLastName())
                .firstName(registerRequest.getFirstName())
                .address(registerRequest.getAddress())
                .createdAt(registerRequest.getCreatedAt())
                .roles(registerRequest.getRoles())

                .build();
        appuserrepo.save(user);
        var jwttoken = jwtservice.generatetoken
                ( user);


        return jwttoken;
    }*/
////
    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder password = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 10; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        return password.toString();
    }
/*    public String register(RegisterRequest registerRequest) throws MessagingException {
        // Générer un mot de passe aléatoire
        String randomPassword = generateRandomPassword();

        // Encoder le mot de passe
        String encodedPassword = passwordEncoder.encode(randomPassword);

        // Créer l'utilisateur avec le mot de passe généré
        var user = AppUser.builder()
                .uuid(registerRequest.getUuid())
                .email(registerRequest.getEmail())
                .password(encodedPassword)
                .phone(registerRequest.getPhone())
                .lastName(registerRequest.getLastName())
                .firstName(registerRequest.getFirstName())
                .address(registerRequest.getAddress())
                .createdAt(registerRequest.getCreatedAt())
                .roles(registerRequest.getRoles())
                .build();

        // Enregistrer l'utilisateur dans la base de données
        appuserrepo.save(user);

        // Préparer les données pour l'e-mail
        Map<String, Object> properties = new HashMap<>();
        properties.put("firstName", user.getFirstName());
        properties.put("password", randomPassword);

        // Envoyer le mot de passe par e-mail à l'utilisateur
        emailService.sendEmail(
                user.getEmail(), // Destinataire
                "Votre compte a été créé", // Sujet
                EmailTemplateName.REGISTRATION_TEMPLATE, // Template d'e-mail
                properties // Données dynamiques
        );

        // Générer un token JWT
        var jwttoken = jwtservice.generatetoken(user);

        return jwttoken;
    }*/
/////



    public String register(RegisterRequest registerRequest) throws MessagingException {
        // Générer et encoder un mot de passe aléatoire
      //  String randomPassword = generateRandomPassword();
      //  String encodedPassword = passwordEncoder.encode(randomPassword);

        // Créer et enregistrer l'utilisateur
        var user = AppUser.builder()
                .email(registerRequest.getEmail())
               // .password(encodedPassword)
               .phone(registerRequest.getPhone())
                .lastName(registerRequest.getLastName())
                .firstName(registerRequest.getFirstName())
                .address(registerRequest.getAddress())
                .roles(registerRequest.getRoles())
                //.tenant(registerRequest.getTenant())

               .enabled(false)
                .build();

       appuserrepo.save(user);

        // Préparer et envoyer l'e-mail de confirmation
      /*  Map<String, Object> properties = Map.of(
                "firstName", user.getFirstName(),
                "password", randomPassword
        );

        emailService.sendEmail(
                user.getEmail(),
                "Votre compte est activé",
                EmailTemplateName.REGISTRATION_TEMPLATE,
                properties
        );*/
 /*       String randomPassword = generateRandomPassword();
        String encodedPassword = passwordEncoder.encode(randomPassword);
        // 2️⃣ Activer le compte
        user.setEnabled(true);
        user.setPassword(encodedPassword);
        appuserrepo.save(user);
        Map<String, Object> properties = Map.of(
                "firstName", user.getFirstName(),
                "password", randomPassword
        );

        emailService.sendEmail(
                user.getEmail(),
                "Votre compte est activé",
                EmailTemplateName.REGISTRATION_TEMPLATE,
                properties
        );
*/
        return "User registered. Awaiting admin activation.";
    }




/*    public void activateAccount(String email) throws MessagingException {
        // 1️⃣ Récupérer l'utilisateur par e-mail
        AppUser user = appuserrepo.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("Utilisateur non trouvé");
        }
        String randomPassword = generateRandomPassword();
        String encodedPassword = passwordEncoder.encode(randomPassword);
        // 2️⃣ Activer le compte
       user.setEnabled(true);
       user.setPassword(encodedPassword);
        appuserrepo.save(user);
        Map<String, Object> properties = Map.of(
                "firstName", user.getFirstName(),
                "password", randomPassword
        );

        emailService.sendEmail(
                user.getEmail(),
                "Votre compte est activé",
                EmailTemplateName.REGISTRATION_TEMPLATE,
                properties
        );

        // 3️⃣ Envoyer un e-mail de confirmation
       // sendActivationConfirmationEmail(user);
    }*/
@Transactional
public AppUser createUserparadmin(AppUser user) {
    // 1. Validation des entrées
    if (user.getEmail() == null || user.getEmail().isEmpty()) {
        throw new IllegalArgumentException("L'email est obligatoire");
    }
    if (user.getFirstName() == null || user.getFirstName().isEmpty()) {
        throw new IllegalArgumentException("Le prénom est obligatoire");
    }


    // 2. Initialisation de l'utilisateur
    user.setEnabled(true);
    user.setCreatedAt(LocalDateTime.now());
   // 3. Génération du mot de passe
    String randomPassword = generateRandomPassword();
    if (randomPassword == null) {
        throw new IllegalStateException("Échec de génération du mot de passe");
    }
    String encodedPassword = passwordEncoder.encode(randomPassword);
    user.setPassword(encodedPassword);
    user.setUuid(UUIDGenerator.generateUUIDForEntity("User"));
    // 4. Sauvegarde de l'utilisateur
    AppUser savedUser = appuserrepo.save(user);




    System.out.println("savedUser.getUuid() "+savedUser.getUuid());




    // 5. Préparation des données pour l'email (avec HashMap au lieu de Map.of)
    Map<String, Object> properties = new HashMap<>();
    properties.put("firstName", user.getFirstName());
    properties.put("password", randomPassword);

    // 6. Envoi de l'email
    try {
        emailService.sendEmail(
                user.getEmail(),
                "Votre compte est activé",
                EmailTemplateName.REGISTRATION_TEMPLATE,
                properties
        );
        log.info("Email de création envoyé à {}", user.getEmail());
    } catch (MessagingException e) {
        log.error("Erreur lors de l'envoi de l'email à {} : {}", user.getEmail(), e.getMessage());
        // Vous pourriez aussi notifier un service de monitoring ici
    }

    return savedUser;
}


public void activateAccount(String email, HttpServletRequest request) throws MessagingException {
    AppUser user = appuserrepo.findByEmail(email);
    if (user == null) {
        throw new RuntimeException("Utilisateur non trouvé");
    }




    String randomPassword = generateRandomPassword();
    String encodedPassword = passwordEncoder.encode(randomPassword);

    user.setEnabled(true);
    user.setPassword(encodedPassword);
    appuserrepo.save(user);


    String userId = request.getHeader("X-User-Id");



    if (userId == null) {
        throw new RuntimeException("User ID non présent dans le header");
    }
    Map<String, Object> properties = Map.of(
            "firstName", user.getFirstName(),
            "password", randomPassword
    );

    emailService.sendEmail(
            user.getEmail(),
            "Votre compte est activé",
            EmailTemplateName.REGISTRATION_TEMPLATE,
            properties
    );
}

    private void sendActivationConfirmationEmail(AppUser user) throws MessagingException {
        Map<String, Object> properties = new HashMap<>();
        properties.put("firstName", user.getFirstName());

        emailService.sendEmail(
                user.getEmail(),
                "Votre compte est activé",
                EmailTemplateName.ACTIVATE_OTP,
                properties
        );
    }











   /* public void activateAccount(String token) throws MessagingException {
        // Vérifier le token
        Token savedToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (LocalDateTime.now().isAfter(savedToken.getExpirationTime())) {
            sendValidationEmail(savedToken.getUser());
            throw new RuntimeException("Activation token has expired. A new token has been sent.");
        }

        // Vérifier l'existence de l'utilisateur
        var user = appuserrepo.findById(savedToken.getUser().getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Activer le compte
        user.setEnabled(true);
        appuserrepo.save(user);

        // Supprimer le token après activation
        tokenRepository.delete(savedToken);

        // Envoyer l'email avec le mot de passe
        Map<String, Object> properties = new HashMap<>();
        properties.put("firstName", user.getFirstName());
        properties.put("password", null);
*//*
        properties.put("confirmationUrl", activationUrl);
*//*
        emailService.sendEmail(
                user.getEmail(),
                "Votre compte est activé",
                EmailTemplateName.REGISTRATION_TEMPLATE,
                properties
        );
    }*/










    //////
    public String authenticate
            (AuthenticationRequest authenticationRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken
                        (authenticationRequest.getEmail(),
                                authenticationRequest.getPassword())
        );
        var user = appuserrepo.findByEmail(authenticationRequest.getEmail());
        var jwttoken = jwtservice.generatetoken
                ( user);
var token = Token
        .builder()
        .user(user)
        .type(TokenType.BEARER)
        .expired(false)
        .revoked(false)
        .token(jwttoken)
        .build();
        revokeallusertoken(user);

tokenRepository.save(token);


        return jwttoken;
    }
    private void revokeallusertoken(AppUser user) {
        var  validusertokens = tokenRepository.findallvalidtokenByUser(user.getId());
        if (validusertokens.isEmpty()) {
            return;
        }
        validusertokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);


        });
        tokenRepository.saveAll(validusertokens);

    }
    /////
  /*  public void activateAccount(String token) throws MessagingException {
        //verify token
        Token savedToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));
        if (LocalDateTime.now().isAfter(savedToken.getExpirationTime())) {
            sendValidationEmail(savedToken.getUser());
            throw new RuntimeException("Activation token has expired. A new token has been send to the same email address");
        }
        //verify existance of user
        var user = appuserrepo.findById(savedToken.getUser().getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));


        appuserrepo.save(user);

        tokenRepository.delete(savedToken);
    }
*/
 /*   private String generateAndSaveActivationToken(AppUser user) {
        String generatedToken = generateActivationCode(6);
        var token = Token.builder()
                .token(generatedToken)
                .expirationTime(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        tokenRepository.save(token);




        return generatedToken;
    }*/

    private String generateActivationCode(int length) {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();

        SecureRandom secureRandom = new SecureRandom();

        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }

        return codeBuilder.toString();
    }

    private void sendValidationEmail(AppUser user) throws MessagingException {


        Map<String, Object> properties = new HashMap<>();
        properties.put("username", user.getFirstName());
        properties.put("email", user.getEmail());
        properties.put("confirmationUrl", null);


        emailService.sendEmail(
                user.getEmail(),
                "Activation de compte",
                EmailTemplateName.ACTIVATE_OTP,
                properties
        );
    }


    @Transactional
    public void demanderReinitialisation(String email) throws MessagingException {
        AppUser user = appuserrepo.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("Aucun élément trouvé pour cette demande");
        }


        // Supprimer les anciens tokens
        tokenRepository.deleteByUser(user);

        // Générer un token unique
        String token = UUID.randomUUID().toString();
        Token passwordResetToken = Token.builder()
                .token(token)
                .user(user)
                .expirationTime(LocalDateTime.now().plusMinutes(15))
                .build();
        tokenRepository.save(passwordResetToken);

        // Construire le lien de réinitialisation
        String resetLink = resetUrl + "?token=" + token;
        sendResetEmail(user, resetLink);

    }

    private void sendResetEmail(AppUser user, String resetLink) throws MessagingException {
        Map<String, Object> properties = new HashMap<>();
        properties.put("username", user.getFirstName());
        properties.put("confirmationUrl", resetLink);

        emailService.sendEmail(
                user.getEmail(),
                "Réinitialisation de votre mot de passe",
                EmailTemplateName.RESET_PASSWORD,
                properties
        );
    }

    @Transactional
    public void reinitialiserMotDePasse(String token, String nouveauMotDePasse) {
        if (nouveauMotDePasse == null || nouveauMotDePasse.isEmpty()) {
            throw new IllegalArgumentException("Le mot de passe ne peut pas être vide");
        }

        Token resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token invalide ou expiré"));

        // Vérifier si le token est encore valide
        if (resetToken.getExpirationTime().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(resetToken);
            throw new IllegalArgumentException("Le token a expiré. Veuillez refaire une demande.");
        }

        // Mettre à jour le mot de passe de l'utilisateur
        AppUser user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(nouveauMotDePasse));
        appuserrepo.save(user);

        // Supprimer le token après réinitialisation réussie
        tokenRepository.delete(resetToken);
    }

    @Transactional
    public void changerMotDePasse(String ancienMotDePasse, String nouveauMotDePasse) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        AppUser user = userrepo.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("Aucun élément trouvé pour cette demande");
        }

        if (!passwordEncoder.matches(ancienMotDePasse, user.getPassword())) {
            throw new IllegalArgumentException("L'ancien mot de passe est incorrect.");
        }

        user.setPassword(passwordEncoder.encode(nouveauMotDePasse));
        userrepo.save(user);
    }

    @Transactional
    public void desaactivateAccount(String uuid)  throws MessagingException {
        AppUser userOptional = appuserrepo.findByUuid(uuid);


            AppUser user = userOptional;

            if (!user.isEnabled()) {
                throw new IllegalStateException("Le compte est déjà désactivé.");
            }

            user.setEnabled(false);
            appuserrepo.save(user);

    }




}
