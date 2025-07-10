package com.example.User_Service.mapper;

import com.example.User_Service.dto.RoleDto;
import com.example.User_Service.dto.UserDto;
import com.example.User_Service.entity.AppRole;
import com.example.User_Service.entity.AppUser;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleMapper INSTANCE = Mappers.getMapper(RoleMapper.class);


    RoleDto toDTO(AppRole appRole);


    AppRole toEntity(RoleDto roleDto);
}
