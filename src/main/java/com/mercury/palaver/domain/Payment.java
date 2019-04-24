package com.mercury.palaver.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Payment.
 */
@Entity
@Table(name = "payment")
public class Payment implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "jhi_date", nullable = false)
    private String date;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Column(name = "ammount", nullable = false)
    private Integer ammount;

    @Column(name = "on_hold")
    private Boolean onHold;

    @ManyToOne
    @JsonIgnoreProperties("payments")
    private BalanceAccount destinyAccount;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("payments")
    private BalanceAccount originAccount;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public Payment date(String date) {
        this.date = date;
        return this;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public Payment description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getAmmount() {
        return ammount;
    }

    public Payment ammount(Integer ammount) {
        this.ammount = ammount;
        return this;
    }

    public void setAmmount(Integer ammount) {
        this.ammount = ammount;
    }

    public Boolean isOnHold() {
        return onHold;
    }

    public Payment onHold(Boolean onHold) {
        this.onHold = onHold;
        return this;
    }

    public void setOnHold(Boolean onHold) {
        this.onHold = onHold;
    }

    public BalanceAccount getDestinyAccount() {
        return destinyAccount;
    }

    public Payment destinyAccount(BalanceAccount balanceAccount) {
        this.destinyAccount = balanceAccount;
        return this;
    }

    public void setDestinyAccount(BalanceAccount balanceAccount) {
        this.destinyAccount = balanceAccount;
    }

    public BalanceAccount getOriginAccount() {
        return originAccount;
    }

    public Payment originAccount(BalanceAccount balanceAccount) {
        this.originAccount = balanceAccount;
        return this;
    }

    public void setOriginAccount(BalanceAccount balanceAccount) {
        this.originAccount = balanceAccount;
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
        Payment payment = (Payment) o;
        if (payment.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), payment.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Payment{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", description='" + getDescription() + "'" +
            ", ammount=" + getAmmount() +
            ", onHold='" + isOnHold() + "'" +
            "}";
    }
}
