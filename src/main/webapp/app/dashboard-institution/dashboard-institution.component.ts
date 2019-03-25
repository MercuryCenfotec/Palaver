import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/core';
import { InstitutionService } from 'app/entities/institution';
import { IInstitution } from 'app/shared/model/institution.model';
import { FocusGroupService } from 'app/entities/focus-group';
import { filter, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { JhiAlertService } from 'ng-jhipster';
import { IParticipant } from 'app/shared/model/participant.model';
import { IAptitudeTest } from 'app/shared/model/aptitude-test.model';
import { AptitudeTestService } from 'app/entities/aptitude-test';

@Component({
    selector: 'jhi-dashboard-institution',
    templateUrl: './dashboard-institution.component.html',
    styleUrls: ['./dashboard-institution.component.scss']
})
export class DashboardInstitutionComponent implements OnInit {
    institution: IInstitution;
    focusGroups: IFocusGroup[];
    participants: IParticipant[];
    aptitudeTests: IAptitudeTest[];
    today: Date;

    constructor(
        protected userService: UserService,
        protected institutionService: InstitutionService,
        protected focusGroupService: FocusGroupService,
        protected jhiAlertService: JhiAlertService,
        protected aptitudeTestService: AptitudeTestService
    ) {}

    loadAll() {
        this.focusGroupService
            .query()
            .pipe(
                filter((res: HttpResponse<IFocusGroup[]>) => res.ok),
                map((res: HttpResponse<IFocusGroup[]>) => res.body)
            )
            .subscribe(
                (res: IFocusGroup[]) => {
                    this.focusGroups = res;
                    this.loadParticipants(this);
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    loadParticipants(pThis) {
        for (let i = 0; i < this.focusGroups.length; i++) {
            this.focusGroups[i].participants.forEach(function(value) {
                if (!pThis.searchParticipant(pThis, value)) {
                    pThis.participants.push(value);
                }
            });
        }
    }

    searchParticipant(pThis, value) {
        let found = false;

        if (pThis.participants.length > 0) {
            pThis.participants.forEach(function(resp) {
                if (resp.id == value.id) {
                    found = true;
                }
            });
        }

        return found;
    }

    ngOnInit() {
        this.today = new Date();
        this.participants = [];
        this.loadAll();
        this.userService.getUserWithAuthorities().subscribe(user => {
            this.institutionService.getByUserUser(user.id).subscribe(institution => {
                this.institution = institution.body;
                this.aptitudeTestService.findAllByInstitution(institution.body.id).subscribe(aptitudeTests => {
                    this.aptitudeTests = aptitudeTests.body;
                });
            });
        });
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
