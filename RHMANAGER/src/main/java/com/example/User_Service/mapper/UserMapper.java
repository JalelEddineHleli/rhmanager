package com.example.User_Service.mapper;

import com.example.User_Service.dto.RoleDto;
import com.example.User_Service.dto.UserDto;
import com.example.User_Service.entity.AppRole;
import com.example.User_Service.entity.AppUser;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = RoleMapper.class)
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(source = "roles", target = "roles", qualifiedByName = "mapRoles")
    UserDto toDTO(AppUser appUser);

    AppUser toEntity(UserDto userDTO);

    @Named("mapRoles")
    default List<RoleDto> mapRoles(List<AppRole> roles) {
        if (roles == null) {
            return null;
        }
        return roles.stream()
                .map(role -> {
                    RoleDto roleDto = new RoleDto();
                    roleDto.setRole(role.getRole());
                    return roleDto;
                })
                .collect(Collectors.toList());
    }




}
