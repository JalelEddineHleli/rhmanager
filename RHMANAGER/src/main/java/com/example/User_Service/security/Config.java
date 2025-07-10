package com.example.User_Service.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class Config {
   private  final JwtAuthenticationFilter jwtauthfilter;
    private final AuthenticationProvider authentificationprovider;
    private final LogoutHandler logouthandler;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors()
                .and()
                .csrf()
                .disable()
                .authorizeHttpRequests()

                .requestMatchers( "/userapi/this/**" ,"/departmentapi/**", "/userapi/**"  ,"/userapi/user/activate/**"  ,"/roleapi/**" )
                .permitAll()

                .anyRequest()
                .authenticated()
                .and()
                .sessionManagement()
                .sessionCreationPolicy( SessionCreationPolicy.STATELESS )
                .and()
                .authenticationProvider(authentificationprovider)
                .addFilterBefore(jwtauthfilter, UsernamePasswordAuthenticationFilter.class)
                .logout()
                .logoutUrl("/userapi/this/logout")
                .addLogoutHandler(logouthandler)
                .logoutSuccessHandler(
                        (request, response, authentication) ->
                    SecurityContextHolder.clearContext()
                )
        ;


        return http.build();
    }
}
