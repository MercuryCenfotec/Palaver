package com.mercury.palaver.web.rest;
import com.mercury.palaver.domain.Ban;
import com.mercury.palaver.service.BanService;
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
 * REST controller for managing Ban.
 */
@RestController
@RequestMapping("/api")
public class BanResource {

    private final Logger log = LoggerFactory.getLogger(BanResource.class);

    private static final String ENTITY_NAME = "ban";

    private final BanService banService;

    public BanResource(BanService banService) {
        this.banService = banService;
    }

    /**
     * POST  /bans : Create a new ban.
     *
     * @param ban the ban to create
     * @return the ResponseEntity with status 201 (Created) and with body the new ban, or with status 400 (Bad Request) if the ban has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/bans")
    public ResponseEntity<Ban> createBan(@Valid @RequestBody Ban ban) throws URISyntaxException {
        log.debug("REST request to save Ban : {}", ban);
        if (ban.getId() != null) {
            throw new BadRequestAlertException("A new ban cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Ban result = banService.save(ban);
        return ResponseEntity.created(new URI("/api/bans/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /bans : Updates an existing ban.
     *
     * @param ban the ban to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated ban,
     * or with status 400 (Bad Request) if the ban is not valid,
     * or with status 500 (Internal Server Error) if the ban couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/bans")
    public ResponseEntity<Ban> updateBan(@Valid @RequestBody Ban ban) throws URISyntaxException {
        log.debug("REST request to update Ban : {}", ban);
        if (ban.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Ban result = banService.save(ban);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, ban.getId().toString()))
            .body(result);
    }

    /**
     * GET  /bans : get all the bans.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of bans in body
     */
    @GetMapping("/bans")
    public List<Ban> getAllBans() {
        log.debug("REST request to get all Bans");
        return banService.findAll();
    }

    /**
     * GET  /bans/:id : get the "id" ban.
     *
     * @param id the id of the ban to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the ban, or with status 404 (Not Found)
     */
    @GetMapping("/bans/{id}")
    public ResponseEntity<Ban> getBan(@PathVariable Long id) {
        log.debug("REST request to get Ban : {}", id);
        Optional<Ban> ban = banService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ban);
    }

    /**
     * DELETE  /bans/:id : delete the "id" ban.
     *
     * @param id the id of the ban to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/bans/{id}")
    public ResponseEntity<Void> deleteBan(@PathVariable Long id) {
        log.debug("REST request to delete Ban : {}", id);
        banService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/bans/verify/{isValid}")
    public List<Ban> getAllBansByStatus(@PathVariable boolean isValid) {
        log.debug("REST request to get all Bans");
        return banService.findAllByStatus(isValid);
    }

    @GetMapping("/bans/verify-institution/{isValid}/{instId}")
    public List<Ban> getAllBansByStatusAndInstitution(@PathVariable("isValid") boolean isValid, @PathVariable("instId") Long instId) {
        log.debug("REST request to get all Bans");
        return banService.findAllByStatusAndInstitution(isValid, instId);
    }

    @GetMapping("/bans/institution-ban/{instId}")
    public List<Ban> getAllBansByInstitution(@PathVariable("instId") Long instId) {
        log.debug("REST request to get all Bans");
        return banService.findAllByInstitution(instId);
    }
}
