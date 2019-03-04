package com.mercury.palaver.repository;

import com.mercury.palaver.domain.BalanceAccount;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the BalanceAccount entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BalanceAccountRepository extends JpaRepository<BalanceAccount, Long> {

}
