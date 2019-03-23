package com.mercury.palaver.repository;

import com.mercury.palaver.domain.Institution;
import com.mercury.palaver.domain.User;
import com.mercury.palaver.domain.UserApp;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.Optional;


/**
 * Spring Data  repository for the Institution entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InstitutionRepository extends JpaRepository<Institution, Long> {
    Optional<Institution> findByUser_User(User user);
    Optional<Institution> findByUser(UserApp user);
}
