package com.mercury.palaver.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A Message.
 */
@Entity
@Table(name = "message")
public class Message implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "send", nullable = false)
    private ZonedDateTime send;

    @Column(name = "is_read")
    private Boolean isRead;

    @NotNull
    @Column(name = "message", nullable = false)
    private String message;

    @Column(name = "is_focus_group")
    private Boolean isFocusGroup;

    @ManyToOne(optional = false)
    @NotNull
    private Chat chat;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getSend() {
        return send;
    }

    public Message send(ZonedDateTime send) {
        this.send = send;
        return this;
    }

    public void setSend(ZonedDateTime send) {
        this.send = send;
    }

    public Boolean isIsRead() {
        return isRead;
    }

    public Message isRead(Boolean isRead) {
        this.isRead = isRead;
        return this;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public String getMessage() {
        return message;
    }

    public Message message(String message) {
        this.message = message;
        return this;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean isIsFocusGroup() {
        return isFocusGroup;
    }

    public Message isFocusGroup(Boolean isFocusGroup) {
        this.isFocusGroup = isFocusGroup;
        return this;
    }

    public void setIsFocusGroup(Boolean isFocusGroup) {
        this.isFocusGroup = isFocusGroup;
    }

    public Chat getChat() {
        return chat;
    }

    public Message chat(Chat chat) {
        this.chat = chat;
        return this;
    }

    public void setChat(Chat chat) {
        this.chat = chat;
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
        Message message = (Message) o;
        if (message.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), message.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Message{" +
            "id=" + getId() +
            ", send='" + getSend() + "'" +
            ", isRead='" + isIsRead() + "'" +
            ", message='" + getMessage() + "'" +
            ", isFocusGroup='" + isIsFocusGroup() + "'" +
            "}";
    }
}
