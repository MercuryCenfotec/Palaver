package com.mercury.palaver.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Ban.
 */
@Entity
@Table(name = "ban")
public class Ban implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reason")
    private String reason;

    @Column(name = "complaint")
    private String complaint;

    @Column(name = "is_valid")
    private Boolean isValid;

    @ManyToOne(optional = false)
    @NotNull
    private Participant participant;

    @ManyToOne(optional = false)
    @NotNull
    private FocusGroup focusGroup;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReason() {
        return reason;
    }

    public Ban reason(String reason) {
        this.reason = reason;
        return this;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getComplaint() {
        return complaint;
    }

    public Ban complaint(String complaint) {
        this.complaint = complaint;
        return this;
    }

    public void setComplaint(String complaint) {
        this.complaint = complaint;
    }

    public Boolean isIsValid() {
        return isValid;
    }

    public Ban isValid(Boolean isValid) {
        this.isValid = isValid;
        return this;
    }

    public void setIsValid(Boolean isValid) {
        this.isValid = isValid;
    }

    public Participant getParticipant() {
        return participant;
    }

    public Ban participant(Participant participant) {
        this.participant = participant;
        return this;
    }

    public void setParticipant(Participant participant) {
        this.participant = participant;
    }

    public FocusGroup getFocusGroup() {
        return focusGroup;
    }

    public Ban focusGroup(FocusGroup focusGroup) {
        this.focusGroup = focusGroup;
        return this;
    }

    public void setFocusGroup(FocusGroup focusGroup) {
        this.focusGroup = focusGroup;
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
        Ban ban = (Ban) o;
        if (ban.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), ban.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Ban{" +
            "id=" + getId() +
            ", reason='" + getReason() + "'" +
            ", complaint='" + getComplaint() + "'" +
            ", isValid='" + isIsValid() + "'" +
            "}";
    }
}
