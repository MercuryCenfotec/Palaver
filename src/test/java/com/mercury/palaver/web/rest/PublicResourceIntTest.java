package com.mercury.palaver.web.rest;

import com.mercury.palaver.PalaverApp;
import com.mercury.palaver.domain.FocusGroup;
import com.mercury.palaver.domain.Institution;
import com.mercury.palaver.repository.FocusGroupRepository;
import com.mercury.palaver.service.AwsS3ApiService;
import com.mercury.palaver.service.FocusGroupService;
import com.mercury.palaver.service.ZoomApiService;
import com.mercury.palaver.web.rest.errors.ExceptionTranslator;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

import static com.mercury.palaver.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the PublicResource REST controller.
 *
 * @see PublicResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PalaverApp.class)
public class PublicResourceIntTest {

    @Autowired
    private FocusGroupRepository focusGroupRepository;

    @Autowired
    private AwsS3ApiService awsS3ApiService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private Validator validator;

    private MockMvc restPublicMockMvc;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PublicResource publicResource = new PublicResource(focusGroupRepository, awsS3ApiService);
        this.restPublicMockMvc = MockMvcBuilders.standaloneSetup(publicResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    @Test
    @Transactional
    public void getFocusGroupByCode() throws Exception {
        // Get the focusGroup
        restPublicMockMvc.perform(get("/api-public/focus-groups/find-by-code/{code}", "codigoPrueba01"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value("codigoPrueba01"));
    }
}
