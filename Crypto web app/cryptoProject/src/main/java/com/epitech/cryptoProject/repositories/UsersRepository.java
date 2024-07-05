package com.epitech.cryptoProject.repositories;

import com.epitech.cryptoProject.data.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UsersRepository extends JpaRepository<User, UUID> {

  Optional<User> getUserByEmail(String email);

  Optional<User> findUserByUuid(UUID uuid);

  @Query("SELECT email FROM User WHERE email = ?1")
  String checkIfEmailExist(String email);

  @Modifying
  @Query("delete from User u where u.uuid in :uuids")
  void deleteAllByUuid(@Param("uuids") List<UUID> uuids);

}
