package com.mercury.palaver.web.rest;
import com.mercury.palaver.domain.SystemVariable;
import com.mercury.palaver.repository.SystemVariableRepository;
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
 * REST controller for managing SystemVariable.
 */
@RestController
@RequestMapping("/api")
public class SystemVariableResource {

    private final Logger log = LoggerFactory.getLogger(SystemVariableResource.class);

    private static final String ENTITY_NAME = "systemVariable";

    private final SystemVariableRepository systemVariableRepository;

    public SystemVariableResource(SystemVariableRepository systemVariableRepository) {
        this.systemVariableRepository = systemVariableRepository;
    }

    /**
     * POST  /system-variables : Create a new systemVariable.
     *
     * @param systemVariable the systemVariable to create
     * @return the ResponseEntity with status 201 (Created) and with body the new systemVariable, or with status 400 (Bad Request) if the systemVariable has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/system-variables")
    public ResponseEntity<SystemVariable> createSystemVariable(@Valid @RequestBody SystemVariable systemVariable) throws URISyntaxException {
        log.debug("REST request to save SystemVariable : {}", systemVariable);
        if (systemVariable.getId() != null) {
            throw new BadRequestAlertException("A new systemVariable cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SystemVariable result = systemVariableRepository.save(systemVariable);
        return ResponseEntity.created(new URI("/api/system-variables/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /system-variables : Updates an existing systemVariable.
     *
     * @param systemVariable the systemVariable to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated systemVariable,
     * or with status 400 (Bad Request) if the systemVariable is not valid,
     * or with status 500 (Internal Server Error) if the systemVariable couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/system-variables")
    public ResponseEntity<SystemVariable> updateSystemVariable(@Valid @RequestBody SystemVariable systemVariable) throws URISyntaxException {
        log.debug("REST request to update SystemVariable : {}", systemVariable);
        if (systemVariable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        SystemVariable result = systemVariableRepository.save(systemVariable);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, systemVariable.getId().toString()))
            .body(result);
    }

    /**
     * GET  /system-variables : get all the systemVariables.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of systemVariables in body
     */
    @GetMapping("/system-variables")
    public List<SystemVariable> getAllSystemVariables() {
        log.debug("REST request to get all SystemVariables");
        return systemVariableRepository.findAll();
    }

    /**
     * GET  /system-variables/:id : get the "id" systemVariable.
     *
     * @param id the id of the systemVariable to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the systemVariable, or with status 404 (Not Found)
     */
    @GetMapping("/system-variables/{id}")
    public ResponseEntity<SystemVariable> getSystemVariable(@PathVariable Long id) {
        log.debug("REST request to get SystemVariable : {}", id);
        Optional<SystemVariable> systemVariable = systemVariableRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(systemVariable);
    }

    /**
     * DELETE  /system-variables/:id : delete the "id" systemVariable.
     *
     * @param id the id of the systemVariable to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/system-variables/{id}")
    public ResponseEntity<Void> deleteSystemVariable(@PathVariable Long id) {
        log.debug("REST request to delete SystemVariable : {}", id);
        systemVariableRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
