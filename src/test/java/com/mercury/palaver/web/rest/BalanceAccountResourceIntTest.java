package com.mercury.palaver.web.rest;

import com.mercury.palaver.PalaverApp;

import com.mercury.palaver.domain.BalanceAccount;
import com.mercury.palaver.repository.BalanceAccountRepository;
import com.mercury.palaver.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;


import static com.mercury.palaver.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the BalanceAccountResource REST controller.
 *
 * @see BalanceAccountResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PalaverApp.class)
public class BalanceAccountResourceIntTest {

    private static final Integer DEFAULT_BALANCE = 1;
    private static final Integer UPDATED_BALANCE = 2;

    private static final Integer DEFAULT_DEBIT_BALANCE = 1;
    private static final Integer UPDATED_DEBIT_BALANCE = 2;

    private static final Integer DEFAULT_CREDIT_BALANCE = 1;
    private static final Integer UPDATED_CREDIT_BALANCE = 2;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private BalanceAccountRepository balanceAccountRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restBalanceAccountMockMvc;

    private BalanceAccount balanceAccount;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final BalanceAccountResource balanceAccountResource = new BalanceAccountResource(balanceAccountRepository);
        this.restBalanceAccountMockMvc = MockMvcBuilders.standaloneSetup(balanceAccountResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BalanceAccount createEntity(EntityManager em) {
        BalanceAccount balanceAccount = new BalanceAccount()
            .balance(DEFAULT_BALANCE)
            .debitBalance(DEFAULT_DEBIT_BALANCE)
            .creditBalance(DEFAULT_CREDIT_BALANCE)
            .description(DEFAULT_DESCRIPTION);
        return balanceAccount;
    }

    @Before
    public void initTest() {
        balanceAccount = createEntity(em);
    }

    @Test
    @Transactional
    public void createBalanceAccount() throws Exception {
        int databaseSizeBeforeCreate = balanceAccountRepository.findAll().size();

        // Create the BalanceAccount
        restBalanceAccountMockMvc.perform(post("/api/balance-accounts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(balanceAccount)))
            .andExpect(status().isCreated());

        // Validate the BalanceAccount in the database
        List<BalanceAccount> balanceAccountList = balanceAccountRepository.findAll();
        assertThat(balanceAccountList).hasSize(databaseSizeBeforeCreate + 1);
        BalanceAccount testBalanceAccount = balanceAccountList.get(balanceAccountList.size() - 1);
        assertThat(testBalanceAccount.getBalance()).isEqualTo(DEFAULT_BALANCE);
        assertThat(testBalanceAccount.getDebitBalance()).isEqualTo(DEFAULT_DEBIT_BALANCE);
        assertThat(testBalanceAccount.getCreditBalance()).isEqualTo(DEFAULT_CREDIT_BALANCE);
        assertThat(testBalanceAccount.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createBalanceAccountWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = balanceAccountRepository.findAll().size();

        // Create the BalanceAccount with an existing ID
        balanceAccount.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBalanceAccountMockMvc.perform(post("/api/balance-accounts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(balanceAccount)))
            .andExpect(status().isBadRequest());

        // Validate the BalanceAccount in the database
        List<BalanceAccount> balanceAccountList = balanceAccountRepository.findAll();
        assertThat(balanceAccountList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkBalanceIsRequired() throws Exception {
        int databaseSizeBeforeTest = balanceAccountRepository.findAll().size();
        // set the field null
        balanceAccount.setBalance(null);

        // Create the BalanceAccount, which fails.

        restBalanceAccountMockMvc.perform(post("/api/balance-accounts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(balanceAccount)))
            .andExpect(status().isBadRequest());

        List<BalanceAccount> balanceAccountList = balanceAccountRepository.findAll();
        assertThat(balanceAccountList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDebitBalanceIsRequired() throws Exception {
        int databaseSizeBeforeTest = balanceAccountRepository.findAll().size();
        // set the field null
        balanceAccount.setDebitBalance(null);

        // Create the BalanceAccount, which fails.

        restBalanceAccountMockMvc.perform(post("/api/balance-accounts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(balanceAccount)))
            .andExpect(status().isBadRequest());

        List<BalanceAccount> balanceAccountList = balanceAccountRepository.findAll();
        assertThat(balanceAccountList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCreditBalanceIsRequired() throws Exception {
        int databaseSizeBeforeTest = balanceAccountRepository.findAll().size();
        // set the field null
        balanceAccount.setCreditBalance(null);

        // Create the BalanceAccount, which fails.

        restBalanceAccountMockMvc.perform(post("/api/balance-accounts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(balanceAccount)))
            .andExpect(status().isBadRequest());

        List<BalanceAccount> balanceAccountList = balanceAccountRepository.findAll();
        assertThat(balanceAccountList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = balanceAccountRepository.findAll().size();
        // set the field null
        balanceAccount.setDescription(null);

        // Create the BalanceAccount, which fails.

        restBalanceAccountMockMvc.perform(post("/api/balance-accounts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(balanceAccount)))
            .andExpect(status().isBadRequest());

        List<BalanceAccount> balanceAccountList = balanceAccountRepository.findAll();
        assertThat(balanceAccountList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllBalanceAccounts() throws Exception {
        // Initialize the database
        balanceAccountRepository.saveAndFlush(balanceAccount);

        // Get all the balanceAccountList
        restBalanceAccountMockMvc.perform(get("/api/balance-accounts?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(balanceAccount.getId().intValue())))
            .andExpect(jsonPath("$.[*].balance").value(hasItem(DEFAULT_BALANCE)))
            .andExpect(jsonPath("$.[*].debitBalance").value(hasItem(DEFAULT_DEBIT_BALANCE)))
            .andExpect(jsonPath("$.[*].creditBalance").value(hasItem(DEFAULT_CREDIT_BALANCE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }
    
    @Test
    @Transactional
    public void getBalanceAccount() throws Exception {
        // Initialize the database
        balanceAccountRepository.saveAndFlush(balanceAccount);

        // Get the balanceAccount
        restBalanceAccountMockMvc.perform(get("/api/balance-accounts/{id}", balanceAccount.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(balanceAccount.getId().intValue()))
            .andExpect(jsonPath("$.balance").value(DEFAULT_BALANCE))
            .andExpect(jsonPath("$.debitBalance").value(DEFAULT_DEBIT_BALANCE))
            .andExpect(jsonPath("$.creditBalance").value(DEFAULT_CREDIT_BALANCE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingBalanceAccount() throws Exception {
        // Get the balanceAccount
        restBalanceAccountMockMvc.perform(get("/api/balance-accounts/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBalanceAccount() throws Exception {
        // Initialize the database
        balanceAccountRepository.saveAndFlush(balanceAccount);

        int databaseSizeBeforeUpdate = balanceAccountRepository.findAll().size();

        // Update the balanceAccount
        BalanceAccount updatedBalanceAccount = balanceAccountRepository.findById(balanceAccount.getId()).get();
        // Disconnect from session so that the updates on updatedBalanceAccount are not directly saved in db
        em.detach(updatedBalanceAccount);
        updatedBalanceAccount
            .balance(UPDATED_BALANCE)
            .debitBalance(UPDATED_DEBIT_BALANCE)
            .creditBalance(UPDATED_CREDIT_BALANCE)
            .description(UPDATED_DESCRIPTION);

        restBalanceAccountMockMvc.perform(put("/api/balance-accounts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedBalanceAccount)))
            .andExpect(status().isOk());

        // Validate the BalanceAccount in the database
        List<BalanceAccount> balanceAccountList = balanceAccountRepository.findAll();
        assertThat(balanceAccountList).hasSize(databaseSizeBeforeUpdate);
        BalanceAccount testBalanceAccount = balanceAccountList.get(balanceAccountList.size() - 1);
        assertThat(testBalanceAccount.getBalance()).isEqualTo(UPDATED_BALANCE);
        assertThat(testBalanceAccount.getDebitBalance()).isEqualTo(UPDATED_DEBIT_BALANCE);
        assertThat(testBalanceAccount.getCreditBalance()).isEqualTo(UPDATED_CREDIT_BALANCE);
        assertThat(testBalanceAccount.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    public void updateNonExistingBalanceAccount() throws Exception {
        int databaseSizeBeforeUpdate = balanceAccountRepository.findAll().size();

        // Create the BalanceAccount

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBalanceAccountMockMvc.perform(put("/api/balance-accounts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(balanceAccount)))
            .andExpect(status().isBadRequest());

        // Validate the BalanceAccount in the database
        List<BalanceAccount> balanceAccountList = balanceAccountRepository.findAll();
        assertThat(balanceAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteBalanceAccount() throws Exception {
        // Initialize the database
        balanceAccountRepository.saveAndFlush(balanceAccount);

        int databaseSizeBeforeDelete = balanceAccountRepository.findAll().size();

        // Delete the balanceAccount
        restBalanceAccountMockMvc.perform(delete("/api/balance-accounts/{id}", balanceAccount.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<BalanceAccount> balanceAccountList = balanceAccountRepository.findAll();
        assertThat(balanceAccountList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BalanceAccount.class);
        BalanceAccount balanceAccount1 = new BalanceAccount();
        balanceAccount1.setId(1L);
        BalanceAccount balanceAccount2 = new BalanceAccount();
        balanceAccount2.setId(balanceAccount1.getId());
        assertThat(balanceAccount1).isEqualTo(balanceAccount2);
        balanceAccount2.setId(2L);
        assertThat(balanceAccount1).isNotEqualTo(balanceAccount2);
        balanceAccount1.setId(null);
        assertThat(balanceAccount1).isNotEqualTo(balanceAccount2);
    }
}
