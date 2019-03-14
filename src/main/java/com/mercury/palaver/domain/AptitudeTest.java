package com.mercury.palaver.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A AptitudeTest.
 */
@Entity
@Table(name = "aptitude_test")
public class AptitudeTest implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "created_date", nullable = false)
    private String createdDate;

    @ManyToOne
    @JsonIgnoreProperties("aptitudeTests")
    private Institution institution;

    @OneToMany(mappedBy = "aptitudeTest")
    private Set<TestQuestion> questions = new HashSet<>();
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

    public AptitudeTest name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public AptitudeTest createdDate(String createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public Institution getInstitution() {
        return institution;
    }

    public AptitudeTest institution(Institution institution) {
        this.institution = institution;
        return this;
    }

    public void setInstitution(Institution institution) {
        this.institution = institution;
    }

    public Set<TestQuestion> getQuestions() {
        return questions;
    }

    public AptitudeTest questions(Set<TestQuestion> testQuestions) {
        this.questions = testQuestions;
        return this;
    }

    public AptitudeTest addQuestions(TestQuestion testQuestion) {
        this.questions.add(testQuestion);
        testQuestion.setAptitudeTest(this);
        return this;
    }

    public AptitudeTest removeQuestions(TestQuestion testQuestion) {
        this.questions.remove(testQuestion);
        testQuestion.setAptitudeTest(null);
        return this;
    }

    public void setQuestions(Set<TestQuestion> testQuestions) {
        this.questions = testQuestions;
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
        AptitudeTest aptitudeTest = (AptitudeTest) o;
        if (aptitudeTest.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), aptitudeTest.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "AptitudeTest{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
