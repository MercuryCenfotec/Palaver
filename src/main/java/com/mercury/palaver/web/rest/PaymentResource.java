package com.mercury.palaver.web.rest;
import com.mercury.palaver.domain.Payment;
import com.mercury.palaver.repository.PaymentRepository;
import com.mercury.palaver.web.rest.errors.BadRequestAlertException;
import com.mercury.palaver.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Payment.
 */
@RestController
@RequestMapping("/api")
public class PaymentResource {

    private final Logger log = LoggerFactory.getLogger(PaymentResource.class);

    private static final String ENTITY_NAME = "payment";

    private final PaymentRepository paymentRepository;

    public PaymentResource(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    /**
     * POST  /payments : Create a new payment.
     *
     * @param payment the payment to create
     * @return the ResponseEntity with status 201 (Created) and with body the new payment, or with status 400 (Bad Request) if the payment has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/payments")
    public ResponseEntity<Payment> createPayment(@Valid @RequestBody Payment payment) throws URISyntaxException {
        log.debug("REST request to save Payment : {}", payment);
        if (payment.getId() != null) {
            throw new BadRequestAlertException("A new payment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Payment result = paymentRepository.save(payment);
        return ResponseEntity.created(new URI("/api/payments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /payments : Updates an existing payment.
     *
     * @param payment the payment to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated payment,
     * or with status 400 (Bad Request) if the payment is not valid,
     * or with status 500 (Internal Server Error) if the payment couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/payments")
    public ResponseEntity<Payment> updatePayment(@Valid @RequestBody Payment payment) throws URISyntaxException {
        log.debug("REST request to update Payment : {}", payment);
        if (payment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Payment result = paymentRepository.save(payment);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, payment.getId().toString()))
            .body(result);
    }

    /**
     * GET  /payments : get all the payments.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of payments in body
     */
    @GetMapping("/payments")
    public List<Payment> getAllPayments() {
        log.debug("REST request to get all Payments");
        return paymentRepository.findAll();
    }

    /**
     * GET  /payments/:id : get the "id" payment.
     *
     * @param id the id of the payment to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the payment, or with status 404 (Not Found)
     */
    @GetMapping("/payments/{id}")
    public ResponseEntity<Payment> getPayment(@PathVariable Long id) {
        log.debug("REST request to get Payment : {}", id);
        Optional<Payment> payment = paymentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(payment);
    }

    /**
     * DELETE  /payments/:id : delete the "id" payment.
     *
     * @param id the id of the payment to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/payments/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        log.debug("REST request to delete Payment : {}", id);
        paymentRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
