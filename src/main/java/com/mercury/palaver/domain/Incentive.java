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
 * A Incentive.
 */
@Entity
@Table(name = "incentive")
public class Incentive implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "image")
    private String image;

    @NotNull
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JsonIgnoreProperties("incentives")
    private Institution institution;

    @OneToMany(mappedBy = "incentive")
    @JsonIgnoreProperties("incentive")
    private Set<FocusGroup> focusGroups = new HashSet<>();
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

    public Incentive name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImage() {
        return image;
    }

    public Incentive image(String image) {
        this.image = image;
        return this;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public Incentive quantity(Integer quantity) {
        this.quantity = quantity;
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getDescription() {
        return description;
    }

    public Incentive description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Institution getInstitution() {
        return institution;
    }

    public Incentive institution(Institution institution) {
        this.institution = institution;
        return this;
    }

    public void setInstitution(Institution institution) {
        this.institution = institution;
    }

    public Set<FocusGroup> getFocusGroups() {
        return focusGroups;
    }

    public Incentive focusGroups(Set<FocusGroup> focusGroups) {
        this.focusGroups = focusGroups;
        return this;
    }

    public Incentive addFocusGroups(FocusGroup focusGroup) {
        this.focusGroups.add(focusGroup);
        focusGroup.setIncentive(this);
        return this;
    }

    public Incentive removeFocusGroups(FocusGroup focusGroup) {
        this.focusGroups.remove(focusGroup);
        focusGroup.setIncentive(null);
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
        Incentive incentive = (Incentive) o;
        if (incentive.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), incentive.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Incentive{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", image='" + getImage() + "'" +
            ", quantity=" + getQuantity() +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
