package com.mercury.palaver.web.rest;
import com.mercury.palaver.domain.UserApp;
import com.mercury.palaver.repository.UserAppRepository;
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
 * REST controller for managing UserApp.
 */
@RestController
@RequestMapping("/api")
public class UserAppResource {

    private final Logger log = LoggerFactory.getLogger(UserAppResource.class);

    private static final String ENTITY_NAME = "userApp";

    private final UserAppRepository userAppRepository;

    public UserAppResource(UserAppRepository userAppRepository) {
        this.userAppRepository = userAppRepository;
    }

    /**
     * POST  /user-apps : Create a new userApp.
     *
     * @param userApp the userApp to create
     * @return the ResponseEntity with status 201 (Created) and with body the new userApp, or with status 400 (Bad Request) if the userApp has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/user-apps")
    public ResponseEntity<UserApp> createUserApp(@Valid @RequestBody UserApp userApp) throws URISyntaxException {
        log.debug("REST request to save UserApp : {}", userApp);
        if (userApp.getId() != null) {
            throw new BadRequestAlertException("A new userApp cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserApp result = userAppRepository.save(userApp);
        return ResponseEntity.created(new URI("/api/user-apps/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /user-apps : Updates an existing userApp.
     *
     * @param userApp the userApp to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated userApp,
     * or with status 400 (Bad Request) if the userApp is not valid,
     * or with status 500 (Internal Server Error) if the userApp couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/user-apps")
    public ResponseEntity<UserApp> updateUserApp(@Valid @RequestBody UserApp userApp) throws URISyntaxException {
        log.debug("REST request to update UserApp : {}", userApp);
        if (userApp.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        UserApp result = userAppRepository.save(userApp);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, userApp.getId().toString()))
            .body(result);
    }

    /**
     * GET  /user-apps : get all the userApps.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of userApps in body
     */
    @GetMapping("/user-apps")
    public List<UserApp> getAllUserApps() {
        log.debug("REST request to get all UserApps");
        return userAppRepository.findAll();
    }

    /**
     * GET  /user-apps/:id : get the "id" userApp.
     *
     * @param id the id of the userApp to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the userApp, or with status 404 (Not Found)
     */
    @GetMapping("/user-apps/{id}")
    public ResponseEntity<UserApp> getUserApp(@PathVariable Long id) {
        log.debug("REST request to get UserApp : {}", id);
        Optional<UserApp> userApp = userAppRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userApp);
    }

    /**
     * GET  /user-apps/user_id/{id} : get the "id" userApp.
     *
     * @param id the id of the userApp to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the userApp, or with status 404 (Not Found)
     */
    @GetMapping("/user-apps/user_id/{id}")
    public ResponseEntity<UserApp> getUserAppByUserId(@PathVariable Long id) {
        log.debug("REST request to get UserApp by User id : {}", id);
        Optional<UserApp> tempUserApp = userAppRepository.findByUser_Id(id);
        return ResponseUtil.wrapOrNotFound(tempUserApp);
    }

    /**
     * DELETE  /user-apps/:id : delete the "id" userApp.
     *
     * @param id the id of the userApp to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/user-apps/{id}")
    public ResponseEntity<Void> deleteUserApp(@PathVariable Long id) {
        log.debug("REST request to delete UserApp : {}", id);
        userAppRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
