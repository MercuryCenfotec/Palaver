package com.mercury.palaver.web.rest;

import com.mercury.palaver.domain.FocusGroup;
import com.mercury.palaver.repository.FocusGroupRepository;
import com.mercury.palaver.web.rest.errors.BadRequestAlertException;
import com.mercury.palaver.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing FocusGroup.
 */
@RestController
@RequestMapping("/api-public")
public class PublicResource {

    private final Logger log = LoggerFactory.getLogger(PublicResource.class);

    private final FocusGroupRepository focusGroupRepository;

    public PublicResource(FocusGroupRepository focusGroupRepository) {
        this.focusGroupRepository = focusGroupRepository;
    }


    /**
     * GET  /focus-groups/find_by_code/:code : get the "code" focusGroup.
     *
     * @param code the code attribute of the focusGroup to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the focusGroup, or with status 404 (Not Found)
     */
    @GetMapping("/focus-groups/find_by_code/{code}")
    public ResponseEntity<FocusGroup> getFocusGroupByCode(@PathVariable String code) {
        log.debug("REST request to get FocusGroup by code: {}", code);
        Optional<FocusGroup> focusGroup = focusGroupRepository.findByCode(code);
        return ResponseUtil.wrapOrNotFound(focusGroup);
    }

}
