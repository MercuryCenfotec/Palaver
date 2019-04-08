package com.mercury.palaver.repository;

import com.mercury.palaver.domain.Ban;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Ban entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BanRepository extends JpaRepository<Ban, Long> {

}
