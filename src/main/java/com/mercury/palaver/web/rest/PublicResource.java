package com.mercury.palaver.web.rest;

import com.mercury.palaver.domain.FocusGroup;
import com.mercury.palaver.repository.FocusGroupRepository;
import com.mercury.palaver.service.AwsS3ApiService;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

/**
 * REST controller for managing FocusGroup.
 */
@RestController
@RequestMapping("/api-public")
public class PublicResource {

    private final Logger log = LoggerFactory.getLogger(PublicResource.class);

    private final FocusGroupRepository focusGroupRepository;
    private final AwsS3ApiService awsS3ApiService;

    public PublicResource(FocusGroupRepository focusGroupRepository, AwsS3ApiService awsS3ApiService) {
        this.focusGroupRepository = focusGroupRepository;
        this.awsS3ApiService = awsS3ApiService;
    }


    /**
     * GET  /focus-groups/find_by_code/:code : get the "code" focusGroup.
     *
     * @param code the code attribute of the focusGroup to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the focusGroup, or with status 404 (Not Found)
     */
    @GetMapping("/focus-groups/find-by-code/{code}")
    public ResponseEntity<FocusGroup> getFocusGroupByCode(@PathVariable String code) {
        log.debug("REST request to get FocusGroup by code: {}", code);
        Optional<FocusGroup> focusGroup = focusGroupRepository.findByCode(code);
        return ResponseUtil.wrapOrNotFound(focusGroup);
    }


    /**
     * POST  /image : Save an image.
     *
     * @param file the image to save in the S3 bucket
     * @return the ResponseEntity with status 201 (Created) and with body the new focusGroup, or with status 400 (Bad Request) if the focusGroup has already an ID
     */
    @PostMapping("/image")
    public ResponseEntity<String> saveImage(@RequestPart(value = "file") MultipartFile file) {
        String url = this.awsS3ApiService.uploadFile(file);
        return ResponseEntity.ok().body(url);
    }


}
