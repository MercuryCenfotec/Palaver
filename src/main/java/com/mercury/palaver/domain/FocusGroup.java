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

    @Column(name = "passing_grade")
    private Integer passingGrade;

    @Column(name = "participants_amount")
    private Integer participantsAmount;

    @Column(name = "status")
    private String status;

    @Column(name = "is_completed")
    private Boolean isCompleted;

    @Column(name = "meeting_is_done")
    private Boolean meetingIsDone;

    @ManyToOne
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

    @ManyToOne
    @JsonIgnoreProperties("focusGroups")
    private AptitudeTest aptitudeTest;

    @OneToOne
    @JoinColumn(unique = true)
    private Meeting meeting;

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

    public Integer getPassingGrade() {
        return passingGrade;
    }

    public FocusGroup passingGrade(Integer passingGrade) {
        this.passingGrade = passingGrade;
        return this;
    }

    public void setPassingGrade(Integer passingGrade) {
        this.passingGrade = passingGrade;
    }

    public Integer getParticipantsAmount() {
        return participantsAmount;
    }

    public FocusGroup participantsAmount(Integer participantsAmount) {
        this.participantsAmount = participantsAmount;
        return this;
    }

    public void setParticipantsAmount(Integer participantsAmount) {
        this.participantsAmount = participantsAmount;
    }

    public String getStatus() {
        return status;
    }

    public FocusGroup status(String status) {
        this.status = status;
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean isIsCompleted() {
        return isCompleted;
    }

    public FocusGroup isCompleted(Boolean isCompleted) {
        this.isCompleted = isCompleted;
        return this;
    }

    public void setIsCompleted(Boolean isCompleted) {
        this.isCompleted = isCompleted;
    }

    public Boolean isMeetingIsDone() {
        return meetingIsDone;
    }

    public FocusGroup meetingIsDone(Boolean meetingIsDone) {
        this.meetingIsDone = meetingIsDone;
        return this;
    }

    public void setMeetingIsDone(Boolean meetingIsDone) {
        this.meetingIsDone = meetingIsDone;
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

    public AptitudeTest getAptitudeTest() {
        return aptitudeTest;
    }

    public FocusGroup aptitudeTest(AptitudeTest aptitudeTest) {
        this.aptitudeTest = aptitudeTest;
        return this;
    }

    public void setAptitudeTest(AptitudeTest aptitudeTest) {
        this.aptitudeTest = aptitudeTest;
    }

    public Meeting getMeeting() {
        return meeting;
    }

    public FocusGroup meeting(Meeting meeting) {
        this.meeting = meeting;
        return this;
    }

    public void setMeeting(Meeting meeting) {
        this.meeting = meeting;
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
            ", passingGrade=" + getPassingGrade() +
            ", participantsAmount=" + getParticipantsAmount() +
            ", status='" + getStatus() + "'" +
            ", isCompleted='" + isIsCompleted() + "'" +
            ", meetingIsDone='" + isMeetingIsDone() + "'" +
            "}";
    }
}
