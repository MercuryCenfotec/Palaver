package com.mercury.palaver.domain;



import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A BalanceAccount.
 */
@Entity
@Table(name = "balance_account")
public class BalanceAccount implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "balance", nullable = false)
    private Integer balance;

    @NotNull
    @Column(name = "debit_balance", nullable = false)
    private Integer debitBalance;

    @NotNull
    @Column(name = "credit_balance", nullable = false)
    private Integer creditBalance;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @OneToOne
    @JoinColumn(unique = true)
    private UserApp user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getBalance() {
        return balance;
    }

    public BalanceAccount balance(Integer balance) {
        this.balance = balance;
        return this;
    }

    public void setBalance(Integer balance) {
        this.balance = balance;
    }

    public Integer getDebitBalance() {
        return debitBalance;
    }

    public BalanceAccount debitBalance(Integer debitBalance) {
        this.debitBalance = debitBalance;
        return this;
    }

    public void setDebitBalance(Integer debitBalance) {
        this.debitBalance = debitBalance;
    }

    public Integer getCreditBalance() {
        return creditBalance;
    }

    public BalanceAccount creditBalance(Integer creditBalance) {
        this.creditBalance = creditBalance;
        return this;
    }

    public void setCreditBalance(Integer creditBalance) {
        this.creditBalance = creditBalance;
    }

    public String getDescription() {
        return description;
    }

    public BalanceAccount description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UserApp getUser() {
        return user;
    }

    public BalanceAccount user(UserApp userApp) {
        this.user = userApp;
        return this;
    }

    public void setUser(UserApp userApp) {
        this.user = userApp;
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
        BalanceAccount balanceAccount = (BalanceAccount) o;
        if (balanceAccount.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), balanceAccount.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "BalanceAccount{" +
            "id=" + getId() +
            ", balance=" + getBalance() +
            ", debitBalance=" + getDebitBalance() +
            ", creditBalance=" + getCreditBalance() +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
