package com.example.User_Service;

import com.example.User_Service.entity.AppRole;
import com.example.User_Service.entity.AppUser;
import com.example.User_Service.repository.RoleRepository;
import com.example.User_Service.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@SpringBootApplication

public class UserServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserServiceApplication.class, args);
	}
/*	@Bean
	CommandLineRunner initSuperAdmin(UserRepository userRepo,
									 RoleRepository roleRepo,
									 PasswordEncoder passwordEncoder) {
		return args -> {
			String superAdminEmail = "superadmin@wind.com";

			if (userRepo.findByEmail(superAdminEmail)==null) {
				// Créer le rôle SUPER_ADMIN s'il n'existe pas
				AppRole superAdminRole = roleRepo.findByRole(AppRole.RoleConstants.ADMIN);
				if (superAdminRole == null) {
					superAdminRole = new AppRole();
					superAdminRole.setRole(AppRole.RoleConstants.ADMIN);
					superAdminRole = roleRepo.save(superAdminRole);
				}


				// Créer le compte Super Admin
				AppUser superAdmin = AppUser.builder()
						.email(superAdminEmail)
						.password(passwordEncoder.encode("superadmin123"))
						.firstName("consultant")
						.lastName("wind")
						.roles(List.of(superAdminRole))
						.enabled(true)
						.build();

				userRepo.save(superAdmin);
				System.out.println("✅ Super Admin account created.");
			} else {
				System.out.println("ℹ️ Super Admin account already exists.");
			}
		};
	}*/

}
