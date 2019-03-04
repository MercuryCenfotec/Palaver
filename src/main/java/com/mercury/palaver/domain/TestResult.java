package com.mercury.palaver.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A TestResult.
 */
@Entity
@Table(name = "test_result")
public class TestResult implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "grade", nullable = false)
    private String grade;

    @ManyToOne
    @JsonIgnoreProperties("testResults")
    private FocusGroup focusGroup;

    @ManyToOne
    @JsonIgnoreProperties("testResults")
    private Participant participant;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGrade() {
        return grade;
    }

    public TestResult grade(String grade) {
        this.grade = grade;
        return this;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public FocusGroup getFocusGroup() {
        return focusGroup;
    }

    public TestResult focusGroup(FocusGroup focusGroup) {
        this.focusGroup = focusGroup;
        return this;
    }

    public void setFocusGroup(FocusGroup focusGroup) {
        this.focusGroup = focusGroup;
    }

    public Participant getParticipant() {
        return participant;
    }

    public TestResult participant(Participant participant) {
        this.participant = participant;
        return this;
    }

    public void setParticipant(Participant participant) {
        this.participant = participant;
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
        TestResult testResult = (TestResult) o;
        if (testResult.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), testResult.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "TestResult{" +
            "id=" + getId() +
            ", grade='" + getGrade() + "'" +
            "}";
    }
}
