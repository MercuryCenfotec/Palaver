package com.mercury.palaver.repository;

import com.mercury.palaver.domain.Meeting;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Meeting entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> {

}
