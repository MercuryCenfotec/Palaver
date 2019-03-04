package com.mercury.palaver.domain;



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
    @Column(name = "jhi_password", nullable = false)
    private String password;

    @NotNull
    @Column(name = "rol", nullable = false)
    private String rol;

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

    public String getPassword() {
        return password;
    }

    public UserApp password(String password) {
        this.password = password;
        return this;
    }

    public void setPassword(String password) {
        this.password = password;
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
            ", password='" + getPassword() + "'" +
            ", rol='" + getRol() + "'" +
            "}";
    }
}
