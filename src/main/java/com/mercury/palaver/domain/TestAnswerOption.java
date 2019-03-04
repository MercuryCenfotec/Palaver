package com.mercury.palaver.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A TestAnswerOption.
 */
@Entity
@Table(name = "test_answer_option")
public class TestAnswerOption implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "answer", nullable = false)
    private String answer;

    @NotNull
    @Column(name = "desired", nullable = false)
    private Boolean desired;

    @ManyToOne
    @JsonIgnoreProperties("testAnswerOptions")
    private TestQuestion testQuestion;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAnswer() {
        return answer;
    }

    public TestAnswerOption answer(String answer) {
        this.answer = answer;
        return this;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public Boolean isDesired() {
        return desired;
    }

    public TestAnswerOption desired(Boolean desired) {
        this.desired = desired;
        return this;
    }

    public void setDesired(Boolean desired) {
        this.desired = desired;
    }

    public TestQuestion getTestQuestion() {
        return testQuestion;
    }

    public TestAnswerOption testQuestion(TestQuestion testQuestion) {
        this.testQuestion = testQuestion;
        return this;
    }

    public void setTestQuestion(TestQuestion testQuestion) {
        this.testQuestion = testQuestion;
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
        TestAnswerOption testAnswerOption = (TestAnswerOption) o;
        if (testAnswerOption.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), testAnswerOption.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "TestAnswerOption{" +
            "id=" + getId() +
            ", answer='" + getAnswer() + "'" +
            ", desired='" + isDesired() + "'" +
            "}";
    }
}
