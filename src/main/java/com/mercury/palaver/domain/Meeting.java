package com.mercury.palaver.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A Meeting.
 */
@Entity
@Table(name = "meeting")
public class Meeting implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "jhi_date", nullable = false)
    private LocalDate date;

    @NotNull
    @Column(name = "jhi_time", nullable = false)
    private ZonedDateTime time;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "call_url")
    private String callURL;

    @Column(name = "call_code")
    private String callCode;

    @OneToOne(mappedBy = "meeting",cascade = CascadeType.REMOVE)
    @JsonIgnore
    private FocusGroup focusGroup;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public Meeting date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public ZonedDateTime getTime() {
        return time;
    }

    public Meeting time(ZonedDateTime time) {
        this.time = time;
        return this;
    }

    public void setTime(ZonedDateTime time) {
        this.time = time;
    }

    public String getName() {
        return name;
    }

    public Meeting name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public Meeting description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCallURL() {
        return callURL;
    }

    public Meeting callURL(String callURL) {
        this.callURL = callURL;
        return this;
    }

    public void setCallURL(String callURL) {
        this.callURL = callURL;
    }

    public String getCallCode() {
        return callCode;
    }

    public Meeting callCode(String callCode) {
        this.callCode = callCode;
        return this;
    }

    public void setCallCode(String callCode) {
        this.callCode = callCode;
    }

    public FocusGroup getFocusGroup() {
        return focusGroup;
    }

    public Meeting focusGroup(FocusGroup focusGroup) {
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
        Meeting meeting = (Meeting) o;
        if (meeting.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), meeting.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Meeting{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", time='" + getTime() + "'" +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", callURL='" + getCallURL() + "'" +
            ", callCode='" + getCallCode() + "'" +
            "}";
    }
}
