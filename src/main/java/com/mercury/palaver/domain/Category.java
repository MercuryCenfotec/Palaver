package com.mercury.palaver.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Category.
 */
@Entity
@Table(name = "category")
public class Category implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @ManyToMany(mappedBy = "categories")
    @JsonIgnore
    private Set<FocusGroup> focusGroups = new HashSet<>();

    @ManyToMany(mappedBy = "categories")
    @JsonIgnore
    private Set<Participant> participants = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Category name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public Category description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<FocusGroup> getFocusGroups() {
        return focusGroups;
    }

    public Category focusGroups(Set<FocusGroup> focusGroups) {
        this.focusGroups = focusGroups;
        return this;
    }

    public Category addFocusGroup(FocusGroup focusGroup) {
        this.focusGroups.add(focusGroup);
        focusGroup.getCategories().add(this);
        return this;
    }

    public Category removeFocusGroup(FocusGroup focusGroup) {
        this.focusGroups.remove(focusGroup);
        focusGroup.getCategories().remove(this);
        return this;
    }

    public void setFocusGroups(Set<FocusGroup> focusGroups) {
        this.focusGroups = focusGroups;
    }

    public Set<Participant> getParticipants() {
        return participants;
    }

    public Category participants(Set<Participant> participants) {
        this.participants = participants;
        return this;
    }

    public Category addParticipant(Participant participant) {
        this.participants.add(participant);
        participant.getCategories().add(this);
        return this;
    }

    public Category removeParticipant(Participant participant) {
        this.participants.remove(participant);
        participant.getCategories().remove(this);
        return this;
    }

    public void setParticipants(Set<Participant> participants) {
        this.participants = participants;
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
        Category category = (Category) o;
        if (category.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), category.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Category{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
