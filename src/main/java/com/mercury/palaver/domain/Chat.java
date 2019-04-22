package com.mercury.palaver.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Chat.
 */
@Entity
@Table(name = "chat")
public class Chat implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "last_send")
    private ZonedDateTime lastSend;

    @Column(name = "last_message")
    private String lastMessage;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("chats")
    private Participant participant;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("chats")
    private FocusGroup focusGroup;

    @OneToMany(mappedBy = "chat")
    private Set<Message> messages = new HashSet<>();
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getLastSend() {
        return lastSend;
    }

    public Chat lastSend(ZonedDateTime lastSend) {
        this.lastSend = lastSend;
        return this;
    }

    public void setLastSend(ZonedDateTime lastSend) {
        this.lastSend = lastSend;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public Chat lastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
        return this;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public Participant getParticipant() {
        return participant;
    }

    public Chat participant(Participant participant) {
        this.participant = participant;
        return this;
    }

    public void setParticipant(Participant participant) {
        this.participant = participant;
    }

    public FocusGroup getFocusGroup() {
        return focusGroup;
    }

    public Chat focusGroup(FocusGroup focusGroup) {
        this.focusGroup = focusGroup;
        return this;
    }

    public void setFocusGroup(FocusGroup focusGroup) {
        this.focusGroup = focusGroup;
    }

    public Set<Message> getMessages() {
        return messages;
    }

    public Chat messages(Set<Message> messages) {
        this.messages = messages;
        return this;
    }

    public Chat addMessage(Message message) {
        this.messages.add(message);
        message.setChat(this);
        return this;
    }

    public Chat removeMessage(Message message) {
        this.messages.remove(message);
        message.setChat(null);
        return this;
    }

    public void setMessages(Set<Message> messages) {
        this.messages = messages;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Chat chat = (Chat) o;
        if (chat.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), chat.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Chat{" +
            "id=" + getId() +
            ", lastSend='" + getLastSend() + "'" +
            ", lastMessage='" + getLastMessage() + "'" +
            "}";
    }
}
