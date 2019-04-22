package com.mercury.palaver.repository;

import com.mercury.palaver.domain.Chat;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the Chat entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findAllByFocusGroup_IdOrderByLastSendAsc(Long id);
    List<Chat> findAllByParticipant_IdOrderByLastSendAsc(Long id);
}
