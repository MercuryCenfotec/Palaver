package com.mercury.palaver.repository;

import com.mercury.palaver.domain.UserApp;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.Optional;


/**
 * Spring Data  repository for the UserApp entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserAppRepository extends JpaRepository<UserApp, Long> {
    Optional<UserApp> findByUser_Id(Long id);
}
