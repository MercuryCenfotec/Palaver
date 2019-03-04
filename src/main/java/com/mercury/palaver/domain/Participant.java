package com.mercury.palaver.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import com.mercury.palaver.domain.enumeration.Gender;

import com.mercury.palaver.domain.enumeration.CivilStatus;

/**
 * A Participant.
 */
@Entity
@Table(name = "participant")
public class Participant implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "birthdate", nullable = false)
    private LocalDate birthdate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "civil_status", nullable = false)
    private CivilStatus civilStatus;

    @Column(name = "picture")
    private String picture;

    @OneToOne
    @JoinColumn(unique = true)
    private UserApp user;

    @ManyToMany
    @JoinTable(name = "participant_category",
               joinColumns = @JoinColumn(name = "participant_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "category_id", referencedColumnName = "id"))
    private Set<Category> categories = new HashSet<>();

    @ManyToMany(mappedBy = "participants")
    @JsonIgnore
    private Set<FocusGroup> focusGroups = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getBirthdate() {
        return birthdate;
    }

    public Participant birthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
        return this;
    }

    public void setBirthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
    }

    public Gender getGender() {
        return gender;
    }

    public Participant gender(Gender gender) {
        this.gender = gender;
        return this;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public CivilStatus getCivilStatus() {
        return civilStatus;
    }

    public Participant civilStatus(CivilStatus civilStatus) {
        this.civilStatus = civilStatus;
        return this;
    }

    public void setCivilStatus(CivilStatus civilStatus) {
        this.civilStatus = civilStatus;
    }

    public String getPicture() {
        return picture;
    }

    public Participant picture(String picture) {
        this.picture = picture;
        return this;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public UserApp getUser() {
        return user;
    }

    public Participant user(UserApp userApp) {
        this.user = userApp;
        return this;
    }

    public void setUser(UserApp userApp) {
        this.user = userApp;
    }

    public Set<Category> getCategories() {
        return categories;
    }

    public Participant categories(Set<Category> categories) {
        this.categories = categories;
        return this;
    }

    public Participant addCategory(Category category) {
        this.categories.add(category);
        category.getParticipants().add(this);
        return this;
    }

    public Participant removeCategory(Category category) {
        this.categories.remove(category);
        category.getParticipants().remove(this);
        return this;
    }

    public void setCategories(Set<Category> categories) {
        this.categories = categories;
    }

    public Set<FocusGroup> getFocusGroups() {
        return focusGroups;
    }

    public Participant focusGroups(Set<FocusGroup> focusGroups) {
        this.focusGroups = focusGroups;
        return this;
    }

    public Participant addFocusGroup(FocusGroup focusGroup) {
        this.focusGroups.add(focusGroup);
        focusGroup.getParticipants().add(this);
        return this;
    }

    public Participant removeFocusGroup(FocusGroup focusGroup) {
        this.focusGroups.remove(focusGroup);
        focusGroup.getParticipants().remove(this);
        return this;
    }

    public void setFocusGroups(Set<FocusGroup> focusGroups) {
        this.focusGroups = focusGroups;
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
        Participant participant = (Participant) o;
        if (participant.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), participant.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Participant{" +
            "id=" + getId() +
            ", birthdate='" + getBirthdate() + "'" +
            ", gender='" + getGender() + "'" +
            ", civilStatus='" + getCivilStatus() + "'" +
            ", picture='" + getPicture() + "'" +
            "}";
    }
}
