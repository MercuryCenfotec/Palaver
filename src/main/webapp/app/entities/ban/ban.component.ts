import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IBan } from 'app/shared/model/ban.model';
import { AccountService, UserService } from 'app/core';
import { BanService } from './ban.service';
import { IInstitution } from 'app/shared/model/institution.model';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'jhi-ban',
    templateUrl: './ban.component.html'
})
export class BanComponent implements OnInit, OnDestroy {
    bans: IBan[];
    currentAccount: any;
    eventSubscriber: Subscription;
    ban: IBan;

    constructor(
        protected banService: BanService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected userService: UserService,
        protected modalService: NgbModal
    ) {}

    loadAll() {
        this.banService
            .findAllByIsValid(false)
            .pipe(
                filter((res: HttpResponse<IBan[]>) => res.ok),
                map((res: HttpResponse<IBan[]>) => res.body)
            )
            .subscribe(
                (res: IBan[]) => {
                    this.filterByComplaint(res);
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    filterByComplaint(allBans: IBan[]) {
        const filteredBans: IBan[] = [];
        for (let i = 0; i < allBans.length; i++) {
            if (allBans[i].complaint !== '') {
                filteredBans.push(allBans[i]);
            }
        }
        this.bans = filteredBans;
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInBans();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IBan) {
        return item.id;
    }

    registerChangeInBans() {
        this.eventSubscriber = this.eventManager.subscribe('banListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    sendInvalid(desiredBan: IBan) {
        this.banService.delete(desiredBan.id).subscribe(deletedBan => {
            this.ngOnInit();
        });
    }

    sendValid(desiredBan: IBan) {
        desiredBan.isValid = true;
        this.banService.update(desiredBan).subscribe(updatedBan => {
            this.loadAllValidBansFromInstitution(desiredBan.focusGroup.institution);
        });
    }

    loadAllValidBansFromInstitution(institution: IInstitution) {
        this.banService
            .findAllByIsValidAndInstitution(true, institution.id)
            .pipe(
                filter((res: HttpResponse<IBan[]>) => res.ok),
                map((res: HttpResponse<IBan[]>) => res.body)
            )
            .subscribe(
                (res: IBan[]) => {
                    this.shouldBeSuspended(institution, res);
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    shouldBeSuspended(institution: IInstitution, validBans: IBan[]) {
        if (validBans.length === 3) {
            this.userService.find(institution.user.user.login).subscribe(foundUser => {
                const institutionToSuspend = foundUser.body;
                institutionToSuspend.activated = false;
                this.userService.update(institutionToSuspend).subscribe(data => {
                    this.obtainAllSuspendedInstitutionBans(institution);
                });
            });
        } else {
            this.ngOnInit();
        }
    }

    obtainAllSuspendedInstitutionBans(institution: IInstitution) {
        this.banService
            .findAllByInstitution(institution.id)
            .pipe(
                filter((res: HttpResponse<IBan[]>) => res.ok),
                map((res: HttpResponse<IBan[]>) => res.body)
            )
            .subscribe(
                (res: IBan[]) => {
                    this.deleteAllSuspendedInstitutionBans(res);
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    deleteAllSuspendedInstitutionBans(bans: IBan[]) {
        for (let i = 0; i < bans.length; i++) {
            this.banService.delete(bans[i].id).subscribe(deleted => {});
        }
        this.ngOnInit();
        this.ngOnInit();
    }

    showDetail(content, ban) {
        this.ban = ban;
        this.openModal(content);
    }

    openModal(content) {
        this.modalService.open(content).result.then(
            result => {
                console.log(`Closed with: ${result}`);
            },
            reason => {
                console.log(`Dismissed ${this.getDismissReason(reason)}`);
            }
        );
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }
}
