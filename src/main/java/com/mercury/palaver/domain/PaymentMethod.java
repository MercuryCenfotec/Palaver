package com.mercury.palaver.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A PaymentMethod.
 */
@Entity
@Table(name = "payment_method")
public class PaymentMethod implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "card_number", nullable = false)
    private Integer cardNumber;

    @NotNull
    @Column(name = "expiration_date", nullable = false)
    private LocalDate expirationDate;

    @NotNull
    @Column(name = "card_name", nullable = false)
    private String cardName;

    @NotNull
    @Column(name = "card_cvv", nullable = false)
    private Integer cardCVV;

    @ManyToOne
    @JsonIgnoreProperties("paymentMethods")
    private UserApp user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getCardNumber() {
        return cardNumber;
    }

    public PaymentMethod cardNumber(Integer cardNumber) {
        this.cardNumber = cardNumber;
        return this;
    }

    public void setCardNumber(Integer cardNumber) {
        this.cardNumber = cardNumber;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public PaymentMethod expirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
        return this;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getCardName() {
        return cardName;
    }

    public PaymentMethod cardName(String cardName) {
        this.cardName = cardName;
        return this;
    }

    public void setCardName(String cardName) {
        this.cardName = cardName;
    }

    public Integer getCardCVV() {
        return cardCVV;
    }

    public PaymentMethod cardCVV(Integer cardCVV) {
        this.cardCVV = cardCVV;
        return this;
    }

    public void setCardCVV(Integer cardCVV) {
        this.cardCVV = cardCVV;
    }

    public UserApp getUser() {
        return user;
    }

    public PaymentMethod user(UserApp userApp) {
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
        PaymentMethod paymentMethod = (PaymentMethod) o;
        if (paymentMethod.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), paymentMethod.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "PaymentMethod{" +
            "id=" + getId() +
            ", cardNumber=" + getCardNumber() +
            ", expirationDate='" + getExpirationDate() + "'" +
            ", cardName='" + getCardName() + "'" +
            ", cardCVV=" + getCardCVV() +
            "}";
    }
}
