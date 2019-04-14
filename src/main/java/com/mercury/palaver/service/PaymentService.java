package com.mercury.palaver.service;

import com.mercury.palaver.domain.*;
import com.mercury.palaver.repository.BalanceAccountRepository;
import com.mercury.palaver.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class PaymentService {
    private final PaymentRepository paymentRepo;
    private final BalanceAccountRepository balanceAccountRepo;

    public PaymentService(PaymentRepository paymentRepo,
                          BalanceAccountRepository balanceAccountRepo) {
        this.paymentRepo = paymentRepo;
        this.balanceAccountRepo = balanceAccountRepo;
    }

    public void saveFocusGroupPayment(Payment payment, UserApp institutionUser) {
        BalanceAccount originAccount = balanceAccountRepo.findByUserId(institutionUser.getId()).get();
        originAccount.setBalance(originAccount.getBalance() - payment.getAmmount());
        originAccount = balanceAccountRepo.save(originAccount);
        payment.setOriginAccount(originAccount);
        payment.setDestinyAccount(balanceAccountRepo.findByUserId(3L).get());
        payment.setOnHold(true);
        payment.setDate(LocalDateTime.now().toString());
        paymentRepo.save(payment);
    }

    public void processParticipantsPayment(FocusGroup group) {
        Payment groupPayment = paymentRepo.findByDescription("Pago por grupo - " + group.getName() + "_" + group.getCode());
        BalanceAccount participantAccount;
        BalanceAccount palaverAccount = balanceAccountRepo.findByUserId(3L).get();
        int costPerParticipant = 25000;
        int costPerUse = 30000;

        for (Participant participant : group.getParticipants()) {
            participantAccount = balanceAccountRepo.findByUserId(participant.getUser().getId()).get();
            processPayment(
                palaverAccount,
                participantAccount,
                "Participacion en grupo de enfoque - " + group.getName() + "_" + group.getCode(),
                costPerParticipant,
                false);
        }
        processPayment(
            palaverAccount,
            palaverAccount,
            "Cuota por uso de la aplicacion - " + group.getName() + "_" + group.getCode(),
            costPerUse,
            false);
        groupPayment.setOnHold(false);
        paymentRepo.save(groupPayment);
    }

    public void processPayment(BalanceAccount originAccount, BalanceAccount targetAccount, String description, int paymentAmount, boolean onHold) {
        Payment newPayment = new Payment();
        newPayment.setDate(LocalDateTime.now().toString());
        newPayment.setDestinyAccount(targetAccount);
        newPayment.setDescription(description);
        newPayment.setAmmount(paymentAmount);
        newPayment.setOnHold(onHold);
        paymentRepo.save(newPayment);
        originAccount.setBalance(originAccount.getBalance()-paymentAmount);
        balanceAccountRepo.save(originAccount);
        targetAccount.setBalance(targetAccount.getBalance()+paymentAmount);
        balanceAccountRepo.save(targetAccount);
    }

}
