package com.mercury.palaver.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * The TestQuestion entity.
 */
@ApiModel(description = "The TestQuestion entity.")
@Entity
@Table(name = "test_question")
public class TestQuestion implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "question", nullable = false)
    private String question;

    @ManyToOne
    @JsonIgnoreProperties("questions")
    private AptitudeTest aptitudeTest;

    @OneToMany(mappedBy = "testQuestion")
    private Set<TestAnswerOption> answers = new HashSet<>();
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public TestQuestion question(String question) {
        this.question = question;
        return this;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public AptitudeTest getAptitudeTest() {
        return aptitudeTest;
    }

    public TestQuestion aptitudeTest(AptitudeTest aptitudeTest) {
        this.aptitudeTest = aptitudeTest;
        return this;
    }

    public void setAptitudeTest(AptitudeTest aptitudeTest) {
        this.aptitudeTest = aptitudeTest;
    }

    public Set<TestAnswerOption> getAnswers() {
        return answers;
    }

    public TestQuestion answers(Set<TestAnswerOption> testAnswerOptions) {
        this.answers = testAnswerOptions;
        return this;
    }

    public TestQuestion addAnswers(TestAnswerOption testAnswerOption) {
        this.answers.add(testAnswerOption);
        testAnswerOption.setTestQuestion(this);
        return this;
    }

    public TestQuestion removeAnswers(TestAnswerOption testAnswerOption) {
        this.answers.remove(testAnswerOption);
        testAnswerOption.setTestQuestion(null);
        return this;
    }

    public void setAnswers(Set<TestAnswerOption> testAnswerOptions) {
        this.answers = testAnswerOptions;
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
        TestQuestion testQuestion = (TestQuestion) o;
        if (testQuestion.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), testQuestion.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "TestQuestion{" +
            "id=" + getId() +
            ", question='" + getQuestion() + "'" +
            "}";
    }
}
