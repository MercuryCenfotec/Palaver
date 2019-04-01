package com.mercury.palaver.domain;



import org.hibernate.action.internal.OrphanRemovalAction;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A UserApp.
 */
@Entity
@Table(name = "user_app")
public class UserApp implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "identification_number", nullable = false)
    private String identificationNumber;

    @NotNull
    @Column(name = "mail", nullable = false)
    private String mail;

    @Column(name = "address")
    private String address;

    @NotNull
    @Column(name = "rol", nullable = false)
    private String rol;

    @OneToOne(cascade = CascadeType.REMOVE,orphanRemoval=true)
    @JoinColumn(unique = true)
    private User user;

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

    public UserApp name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIdentificationNumber() {
        return identificationNumber;
    }

    public UserApp identificationNumber(String identificationNumber) {
        this.identificationNumber = identificationNumber;
        return this;
    }

    public void setIdentificationNumber(String identificationNumber) {
        this.identificationNumber = identificationNumber;
    }

    public String getMail() {
        return mail;
    }

    public UserApp mail(String mail) {
        this.mail = mail;
        return this;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getAddress() {
        return address;
    }

    public UserApp address(String address) {
        this.address = address;
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getRol() {
        return rol;
    }

    public UserApp rol(String rol) {
        this.rol = rol;
        return this;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public User getUser() {
        return user;
    }

    public UserApp user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
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
        UserApp userApp = (UserApp) o;
        if (userApp.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), userApp.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "UserApp{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", identificationNumber='" + getIdentificationNumber() + "'" +
            ", mail='" + getMail() + "'" +
            ", address='" + getAddress() + "'" +
            ", rol='" + getRol() + "'" +
            "}";
    }
}
