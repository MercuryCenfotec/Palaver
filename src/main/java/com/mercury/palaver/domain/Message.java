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

    @ManyToOne(optional = false)
    @NotNull
    private UserApp receiver;

    @ManyToOne(optional = false)
    @NotNull
    private UserApp transmitter;

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

    public UserApp getReceiver() {
        return receiver;
    }

    public Message receiver(UserApp userApp) {
        this.receiver = userApp;
        return this;
    }

    public void setReceiver(UserApp userApp) {
        this.receiver = userApp;
    }

    public UserApp getTransmitter() {
        return transmitter;
    }

    public Message transmitter(UserApp userApp) {
        this.transmitter = userApp;
        return this;
    }

    public void setTransmitter(UserApp userApp) {
        this.transmitter = userApp;
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
            "}";
    }
}
