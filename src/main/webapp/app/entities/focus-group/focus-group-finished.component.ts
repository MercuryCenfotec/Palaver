import { Component, ElementRef, OnInit, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import { LoginService, StateStorageService } from 'app/core';
import { FocusGroupService } from 'app/entities/focus-group/focus-group.service';

@Component({
    selector: 'jhi-focus-group-finished',
    templateUrl: './focus-group-finished.component.html'
})
export class FocusGroupFinishedComponent implements OnInit {
    constructor(private router: Router, private loginService: LoginService) {}

    ngOnInit(): void {}

    endSession(): void {
        this.loginService.logout();
        this.router.navigate(['']);
    }
}
