package com.mercury.palaver.repository;

import com.mercury.palaver.domain.Message;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the Message entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findAllByChat_IdOrderBySendAsc(Long id);
}
