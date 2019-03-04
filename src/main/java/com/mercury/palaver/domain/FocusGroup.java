package com.mercury.palaver.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A FocusGroup.
 */
@Entity
@Table(name = "focus_group")
public class FocusGroup implements Serializable {

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

    @NotNull
    @Column(name = "begin_date", nullable = false)
    private LocalDate beginDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "code")
    private String code;

    @ManyToOne
    @JsonIgnoreProperties("focusGroups")
    private Incentive incentive;

    @ManyToOne
    @JsonIgnoreProperties("focusGroups")
    private Institution institution;

    @ManyToMany
    @JoinTable(name = "focus_group_category",
               joinColumns = @JoinColumn(name = "focus_group_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "category_id", referencedColumnName = "id"))
    private Set<Category> categories = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "focus_group_participant",
               joinColumns = @JoinColumn(name = "focus_group_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "participant_id", referencedColumnName = "id"))
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

    public FocusGroup name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public FocusGroup description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getBeginDate() {
        return beginDate;
    }

    public FocusGroup beginDate(LocalDate beginDate) {
        this.beginDate = beginDate;
        return this;
    }

    public void setBeginDate(LocalDate beginDate) {
        this.beginDate = beginDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public FocusGroup endDate(LocalDate endDate) {
        this.endDate = endDate;
        return this;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getCode() {
        return code;
    }

    public FocusGroup code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Incentive getIncentive() {
        return incentive;
    }

    public FocusGroup incentive(Incentive incentive) {
        this.incentive = incentive;
        return this;
    }

    public void setIncentive(Incentive incentive) {
        this.incentive = incentive;
    }

    public Institution getInstitution() {
        return institution;
    }

    public FocusGroup institution(Institution institution) {
        this.institution = institution;
        return this;
    }

    public void setInstitution(Institution institution) {
        this.institution = institution;
    }

    public Set<Category> getCategories() {
        return categories;
    }

    public FocusGroup categories(Set<Category> categories) {
        this.categories = categories;
        return this;
    }

    public FocusGroup addCategory(Category category) {
        this.categories.add(category);
        category.getFocusGroups().add(this);
        return this;
    }

    public FocusGroup removeCategory(Category category) {
        this.categories.remove(category);
        category.getFocusGroups().remove(this);
        return this;
    }

    public void setCategories(Set<Category> categories) {
        this.categories = categories;
    }

    public Set<Participant> getParticipants() {
        return participants;
    }

    public FocusGroup participants(Set<Participant> participants) {
        this.participants = participants;
        return this;
    }

    public FocusGroup addParticipant(Participant participant) {
        this.participants.add(participant);
        participant.getFocusGroups().add(this);
        return this;
    }

    public FocusGroup removeParticipant(Participant participant) {
        this.participants.remove(participant);
        participant.getFocusGroups().remove(this);
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
        FocusGroup focusGroup = (FocusGroup) o;
        if (focusGroup.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), focusGroup.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "FocusGroup{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", beginDate='" + getBeginDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", code='" + getCode() + "'" +
            "}";
    }
}
