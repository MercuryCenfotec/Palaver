import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { AccountService, UserService } from 'app/core';
import { FocusGroupService } from './focus-group.service';
import { InstitutionService } from 'app/entities/institution';

@Component({
    selector: 'jhi-focus-group',
    templateUrl: './focus-group.component.html'
})
export class FocusGroupComponent implements OnInit, OnDestroy {
    focusGroups: IFocusGroup[];
    currentAccount: any;
    eventSubscriber: Subscription;
    searchText;

    constructor(
        protected focusGroupService: FocusGroupService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected userService: UserService,
        protected institutionService: InstitutionService
    ) {}

    loadAll() {
        this.userService.getUserWithAuthorities().subscribe(user => {
            this.institutionService.getByUserUser(user.id).subscribe(institution => {
                this.focusGroupService.findAllByInstitution(institution.body.id).subscribe(groups => {
                    this.focusGroups = groups.body;
                });
            });
        });
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInFocusGroups();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IFocusGroup) {
        return item.id;
    }

    registerChangeInFocusGroups() {
        this.eventSubscriber = this.eventManager.subscribe('focusGroupListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
