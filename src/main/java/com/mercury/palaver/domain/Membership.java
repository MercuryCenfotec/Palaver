package com.mercury.palaver.domain;



import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Membership.
 */
@Entity
@Table(name = "membership")
public class Membership implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "type_membership", nullable = false)
    private String typeMembership;

    @NotNull
    @Column(name = "jhi_cost", nullable = false)
    private Integer cost;

    @NotNull
    @Column(name = "duration", nullable = false)
    private Integer duration;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTypeMembership() {
        return typeMembership;
    }

    public Membership typeMembership(String typeMembership) {
        this.typeMembership = typeMembership;
        return this;
    }

    public void setTypeMembership(String typeMembership) {
        this.typeMembership = typeMembership;
    }

    public Integer getCost() {
        return cost;
    }

    public Membership cost(Integer cost) {
        this.cost = cost;
        return this;
    }

    public void setCost(Integer cost) {
        this.cost = cost;
    }

    public Integer getDuration() {
        return duration;
    }

    public Membership duration(Integer duration) {
        this.duration = duration;
        return this;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
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
        Membership membership = (Membership) o;
        if (membership.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), membership.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Membership{" +
            "id=" + getId() +
            ", typeMembership='" + getTypeMembership() + "'" +
            ", cost=" + getCost() +
            ", duration=" + getDuration() +
            "}";
    }
}
