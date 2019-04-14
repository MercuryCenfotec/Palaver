import {Component, OnDestroy, OnInit} from '@angular/core';
import {IBan} from 'app/shared/model/ban.model';
import {Subscription} from 'rxjs';
import {BanService} from 'app/entities/ban';
import {JhiAlertService, JhiEventManager} from 'ng-jhipster';
import {AccountService, UserService} from 'app/core';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {filter, map} from 'rxjs/operators';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {ParticipantService} from 'app/entities/participant';
import {UserAppService} from 'app/entities/user-app';

@Component({
    selector: 'jhi-participant-expulsions',
    templateUrl: './participant-expulsions.component.html',
    styles: []
})
export class ParticipantExpulsionsComponent implements OnInit, OnDestroy {

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
        protected modalService: NgbModal,
        protected participantService: ParticipantService,
        protected userAppService: UserAppService
    ) {
    }

    loadAll() {
        this.userService.getUserWithAuthorities().subscribe(jhiUser => {
            this.userAppService.findByUserId(jhiUser.id).subscribe(userApp => {
                this.participantService.findByUser(userApp.id).subscribe(participant => {
                    this.banService
                        .findAllByParticipant(participant.id)
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
                });
            });
        });
    }

    filterByComplaint(allBans: IBan[]) {
        const filteredBans: IBan[] = [];
        for (let i = 0; i < allBans.length; i++) {
            if (allBans[i].complaint === '') {
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

    sendReport(input, ban: IBan) {
        ban.complaint = input.value;
        if (ban.complaint !== '') {
            this.banService.update(ban).subscribe( updatedBan => {
                this.ngOnInit();
            });
        }
    }

}
