package com.mercury.palaver.web.rest;
import com.mercury.palaver.domain.FocusGroup;
import com.mercury.palaver.repository.FocusGroupRepository;
import com.mercury.palaver.service.FocusGroupService;
import com.mercury.palaver.web.rest.errors.BadRequestAlertException;
import com.mercury.palaver.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.*;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaDelete;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.CriteriaUpdate;
import javax.persistence.metamodel.Metamodel;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST controller for managing FocusGroup.
 */
@RestController
@RequestMapping("/api")
public class FocusGroupResource {

    private final Logger log = LoggerFactory.getLogger(FocusGroupResource.class);

    private static final String ENTITY_NAME = "focusGroup";

    private final FocusGroupRepository focusGroupRepository;
    private final FocusGroupService focusGroupService;

    public FocusGroupResource(FocusGroupRepository focusGroupRepository, FocusGroupService focusGroupService) {
        this.focusGroupRepository = focusGroupRepository;
        this.focusGroupService = focusGroupService;
    }

    /**
     * POST  /focus-groups : Create a new focusGroup.
     *
     * @param focusGroup the focusGroup to create
     * @return the ResponseEntity with status 201 (Created) and with body the new focusGroup, or with status 400 (Bad Request) if the focusGroup has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/focus-groups")
    public ResponseEntity<FocusGroup> createFocusGroup(@Valid @RequestBody FocusGroup focusGroup) throws URISyntaxException {
        log.debug("REST request to save FocusGroup : {}", focusGroup);
        if (focusGroup.getId() != null) {
            throw new BadRequestAlertException("A new focusGroup cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FocusGroup result = focusGroupService.save(focusGroup);
        return ResponseEntity.created(new URI("/api/focus-groups/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /focus-groups : Updates an existing focusGroup.
     *
     * @param focusGroup the focusGroup to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated focusGroup,
     * or with status 400 (Bad Request) if the focusGroup is not valid,
     * or with status 500 (Internal Server Error) if the focusGroup couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/focus-groups")
    public ResponseEntity<FocusGroup> updateFocusGroup(@Valid @RequestBody FocusGroup focusGroup) throws URISyntaxException {
        log.debug("REST request to update FocusGroup : {}", focusGroup);
        if (focusGroup.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        FocusGroup result = focusGroupRepository.save(focusGroup);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, focusGroup.getId().toString()))
            .body(result);
    }

    /**
     * GET  /focus-groups : get all the focusGroups.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many)
     * @return the ResponseEntity with status 200 (OK) and the list of focusGroups in body
     */
    @GetMapping("/focus-groups")
    public List<FocusGroup> getAllFocusGroups(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all FocusGroups");
        return focusGroupRepository.findAllWithEagerRelationships();
    }

    /**
     * GET  /focus-groups/:id : get the "id" focusGroup.
     *
     * @param id the id of the focusGroup to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the focusGroup, or with status 404 (Not Found)
     */
    @GetMapping("/focus-groups/{id}")
    public ResponseEntity<FocusGroup> getFocusGroup(@PathVariable Long id) {
        log.debug("REST request to get FocusGroup : {}", id);
        Optional<FocusGroup> focusGroup = focusGroupRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(focusGroup);
    }

    /**
     * DELETE  /focus-groups/:id : delete the "id" focusGroup.
     *
     * @param id the id of the focusGroup to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/focus-groups/{id}")
    public ResponseEntity<Void> deleteFocusGroup(@PathVariable Long id) {
        log.debug("REST request to delete FocusGroup : {}", id);
        focusGroupRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @PostMapping("/focus-groups/merge")
    public void mergeFocusGroup(@Valid @RequestBody FocusGroup focusGroup) {

        EntityManagerFactory emf;
        EntityManager entityManager;
        EntityTransaction transaction;

        emf = Persistence.createEntityManagerFactory("jbd-pu");
        entityManager = emf.createEntityManager();
        transaction = entityManager.getTransaction();
        transaction.begin();

        entityManager.merge(focusGroup);
    }

}
