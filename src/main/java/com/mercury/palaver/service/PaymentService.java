package com.mercury.palaver.service;

import com.mercury.palaver.domain.*;
import com.mercury.palaver.repository.BalanceAccountRepository;
import com.mercury.palaver.repository.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.exception.*;
import com.stripe.model.BankAccount;
import com.stripe.model.Charge;
import com.stripe.model.Payout;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

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

    public void saveFocusGroupPayment(Payment payment, Long institutionUserId) {
        BalanceAccount originAccount = balanceAccountRepo.findByUserId(institutionUserId).get();
        processPayment(
            originAccount,
            balanceAccountRepo.findByUserId(1L).get(),
            payment.getDescription(),
            payment.getAmmount(),
            true);
    }

    public void returnParticipantFare(FocusGroup group) {
        Payment groupPayment = paymentRepo.findByDescription("Pago por grupo - " + group.getName() + "_" + group.getCode());
        BalanceAccount palaverAccount = balanceAccountRepo.findByUserId(1L).get();
        BalanceAccount institutionAccount = balanceAccountRepo.findByUserId(group.getInstitution().getId ()).get();
        processPayment(
            palaverAccount,
            institutionAccount,
            "Devolucion de tarifa de participante - " + group.getName() + "_" + group.getCode(),
            25000,
            false
        );
    }

    public void returnFocusGroupPayment (FocusGroup group) {
        Payment groupPayment = paymentRepo.findByDescription("Pago por grupo - " + group.getName() + "_" + group.getCode());
        BalanceAccount palaverAccount = balanceAccountRepo.findByUserId(1L).get();
        BalanceAccount institutionAccount = balanceAccountRepo.findByUserId(group.getInstitution().getUser().getId()).get();
        processPayment(
            palaverAccount,
            institutionAccount,
            "Devolucion de pago de grupo - " + group.getName() + "_" + group.getCode(),
            groupPayment.getAmmount(),
            false
        );
        groupPayment.setOnHold(false);
        paymentRepo.save(groupPayment);
    }

    public void processParticipantsPayment(FocusGroup group) {
        Payment groupPayment = paymentRepo.findByDescription("Pago por grupo - " + group.getName() + "_" + group.getCode());
        BalanceAccount participantAccount;
        BalanceAccount palaverAccount = balanceAccountRepo.findByUserId(1L).get();
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

//    public void retrieveAccountFunds (Long userId, String number, String amount) {
//        Stripe.apiKey = "sk_test_s2qDEcoQUSxQXRLehHfwlJYL00xHAbrFhK";
////        Map<String, Object> payoutParams = new HashMap<String, Object>();
////        Map<String, Object> cardParams = new HashMap<String, Object>();
//        Map<String, Object> params = new HashMap<>();
//        params.put("amount", 5000);
//        params.put("currency", "crc");
//        params.put("destination", "ba_1EQiPhJx5FBuHQRyM6Z9fK34");
//
////        cardParams.put("number", number+"");
////        cardParams.put("token", "tok_visa_debit_transferSuccess");
////        payoutParams.put("amount", amount);
////        payoutParams.put("currency", "crc");
////        payoutParams.put("routing_number", "110000000");
////        payoutParams.put("account_number", "000123456789");
////        payoutParams.put("card", cardParams);
//
//        try {
//            Payout.create(params);
//        } catch (AuthenticationException e) {
//            e.printStackTrace();
//        } catch (InvalidRequestException e) {
//            e.printStackTrace();
//        } catch (APIConnectionException e) {
//            e.printStackTrace();
//        } catch (CardException e) {
//            e.printStackTrace();
//        } catch (APIException e) {
//            e.printStackTrace();
//        }
//    }

    private void processPayment(BalanceAccount originAccount, BalanceAccount targetAccount, String description, int paymentAmount, boolean onHold) {
        Payment newPayment = new Payment();
        newPayment.setDate(LocalDateTime.now().toString());
        newPayment.setOriginAccount(originAccount);
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

    public void createPayment(BalanceAccount originAccount, BalanceAccount targetAccount, String description, int paymentAmount, boolean onHold) {
        Payment newPayment = new Payment();
        newPayment.setDate(LocalDateTime.now().toString());
        newPayment.setOriginAccount(originAccount);
        newPayment.setDestinyAccount(targetAccount);
        newPayment.setDescription(description);
        newPayment.setAmmount(paymentAmount);
        newPayment.setOnHold(onHold);
        paymentRepo.save(newPayment);
    }

}
