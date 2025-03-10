package com.dangphuoctai.App_Chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dangphuoctai.App_Chat.entity.Role;

@Repository
public interface RoleRepo extends JpaRepository<Role, Long> {

}