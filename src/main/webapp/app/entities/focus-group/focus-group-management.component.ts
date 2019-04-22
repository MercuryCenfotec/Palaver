import { Component, OnInit } from '@angular/core';
import { IParticipant, Participant } from 'app/shared/model/participant.model';
import { IMeeting } from 'app/shared/model/meeting.model';
import { UserService } from 'app/core';
import { FocusGroupService } from 'app/entities/focus-group/focus-group.service';
import { MeetingService } from 'app/entities/meeting';
import { ParticipantService } from 'app/entities/participant';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { filter, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ClipboardService } from 'ngx-clipboard';
import * as moment from 'moment';
import { BanService } from 'app/entities/ban';
import { Ban, IBan } from 'app/shared/model/ban.model';
import { NotificationService } from 'app/entities/notification';
import { Notification } from 'app/shared/model/notification.model';
import {JhiAlertService} from 'ng-jhipster';
import {NavigationEnd, Router} from '@angular/router';

@Component({
    selector: 'jhi-focus-group-management',
    templateUrl: './focus-group-management.component.html'
})
export class FocusGroupManagementComponent implements OnInit {
    meeting: IMeeting;
    participants: Participant[];
    participant: IParticipant;
    focusGroup: IFocusGroup;
    ban = new Ban(null, '', '', null, null, null);
    searchText;

    constructor(
        protected userService: UserService,
        private _clipboardService: ClipboardService,
        protected focusGroupService: FocusGroupService,
        protected meetingsService: MeetingService,
        protected participantService: ParticipantService,
        protected modalService: NgbModal,
        protected banService: BanService,
        protected notificationService: NotificationService,
        protected jhiAlertService: JhiAlertService,
        protected router: Router
    ) {
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (event.url === '/focus-group/management') {
                    this.ngOnInit();
                }
            }
        });
    }

    ngOnInit() {
        this.meeting = null;
        this.userService.getUserWithAuthorities().subscribe(user => {
            this.focusGroupService
                .query()
                .pipe(
                    filter((res: HttpResponse<IFocusGroup[]>) => res.ok),
                    map((res: HttpResponse<IFocusGroup[]>) => res.body)
                )
                .subscribe(
                    (res: IFocusGroup[]) => {
                        for (let i = 0; i < res.length; i++) {
                            if (res[i].code === user.login) {
                                this.focusGroup = res[i];
                                this.meetingsService.findByGroupId(this.focusGroup.id).subscribe(meetings => {
                                    this.meeting = meetings.body.length ? meetings.body[0] : null;
                                });
                                if (this.focusGroup.meetingIsDone) {
                                    this.router.navigate(['/', 'focus-group', 'finished']);
                                }
                            }
                        }
                    },
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
        });
    }

    copy() {
        this._clipboardService.copyFromContent(this.meeting.callCode);
    }

    expulsion(participant, modalToDisplay) {
        this.participant = participant;
        this.openModal(modalToDisplay);
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

    sendExpulsionMotive(input) {
        for (let i = 0; i < this.focusGroup.participants.length; i++) {
            if (this.focusGroup.participants[i].id === this.participant.id) {
                this.focusGroup.participants.splice(i, 1);
            }
        }
        this.ban.reason = input.value;
        this.ban.focusGroup = this.focusGroup;
        this.ban.participant = this.participant;

        this.banService.create(this.ban).subscribe(newBan => {
            this.focusGroupService.update(this.focusGroup).subscribe(data => {
                const newNotification = new Notification(
                    null,
                    this.participant.user.user.id.toString(),
                    'GroupExpulsion',
                    false,
                    newBan.body.id
                );
                this.notificationService.create(newNotification).subscribe(createdNoti => {
                    this.ngOnInit();
                });
            });
        });
    }

    checkDate() {
        if (this.meeting === null) {
            return;
        } else {
            return (
                this.meeting.date.toDate().getDate() ===
                moment()
                    .toDate()
                    .getDate()
            );
        }
    }

    startMeeting() {
        window.open(this.meeting.callURL);
        this.focusGroupService.finishFocusGroup(this.focusGroup.id).subscribe(group => {
            console.log(group);
            this.__router.navigate(['/', 'focus-group', 'finished']);
        });
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
