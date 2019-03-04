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
 * A Institution.
 */
@Entity
@Table(name = "institution")
public class Institution implements Serializable {

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
    @Column(name = "logo", nullable = false)
    private String logo;

    @NotNull
    @Column(name = "telephone", nullable = false)
    private String telephone;

    @OneToOne
    @JoinColumn(unique = true)
    private UserApp user;

    @OneToMany(mappedBy = "institution")
    private Set<AptitudeTest> aptitudeTests = new HashSet<>();
    @ManyToOne
    @JsonIgnoreProperties("institutions")
    private Membership membership;

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

    public Institution name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public Institution description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLogo() {
        return logo;
    }

    public Institution logo(String logo) {
        this.logo = logo;
        return this;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getTelephone() {
        return telephone;
    }

    public Institution telephone(String telephone) {
        this.telephone = telephone;
        return this;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public UserApp getUser() {
        return user;
    }

    public Institution user(UserApp userApp) {
        this.user = userApp;
        return this;
    }

    public void setUser(UserApp userApp) {
        this.user = userApp;
    }

    public Set<AptitudeTest> getAptitudeTests() {
        return aptitudeTests;
    }

    public Institution aptitudeTests(Set<AptitudeTest> aptitudeTests) {
        this.aptitudeTests = aptitudeTests;
        return this;
    }

    public Institution addAptitudeTest(AptitudeTest aptitudeTest) {
        this.aptitudeTests.add(aptitudeTest);
        aptitudeTest.setInstitution(this);
        return this;
    }

    public Institution removeAptitudeTest(AptitudeTest aptitudeTest) {
        this.aptitudeTests.remove(aptitudeTest);
        aptitudeTest.setInstitution(null);
        return this;
    }

    public void setAptitudeTests(Set<AptitudeTest> aptitudeTests) {
        this.aptitudeTests = aptitudeTests;
    }

    public Membership getMembership() {
        return membership;
    }

    public Institution membership(Membership membership) {
        this.membership = membership;
        return this;
    }

    public void setMembership(Membership membership) {
        this.membership = membership;
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
        Institution institution = (Institution) o;
        if (institution.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), institution.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Institution{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", logo='" + getLogo() + "'" +
            ", telephone='" + getTelephone() + "'" +
            "}";
    }
}
