import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/core';
import { InstitutionService } from 'app/entities/institution';
import { IInstitution } from 'app/shared/model/institution.model';
import { FocusGroupService } from 'app/entities/focus-group';
import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { JhiAlertService } from 'ng-jhipster';
import { IParticipant } from 'app/shared/model/participant.model';
import { IAptitudeTest } from 'app/shared/model/aptitude-test.model';
import { AptitudeTestService } from 'app/entities/aptitude-test';
import moment = require('moment');
import { Moment } from 'moment';
import { Membership } from 'app/shared/model/membership.model';
import { Observable } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BalanceAccountService } from 'app/entities/balance-account';

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
    today: string;
    endedFG = 0;
    onCourseFG = 0;

    constructor(
        protected userService: UserService,
        protected institutionService: InstitutionService,
        protected focusGroupService: FocusGroupService,
        protected jhiAlertService: JhiAlertService,
        protected aptitudeTestService: AptitudeTestService,
        protected accountService: BalanceAccountService
    ) {}

    loadAll() {
        this.userService.getUserWithAuthorities().subscribe(user => {
            this.institutionService.getByUserUser(user.id).subscribe(institution => {
                this.focusGroupService.findAllByInstitution(institution.body.id).subscribe(groups => {
                    this.focusGroups = groups.body;
                    this.loadInfo();
                });
                this.aptitudeTestService.findAllByInstitution(institution.body.id).subscribe(tests => {
                    this.aptitudeTests = tests.body;
                });
            });
        });
    }

    loadInfo() {
        this.focusGroups.forEach(resp => {
            if (resp.endDate.toString() < moment().format('YYYY-MM-DD')) {
                this.endedFG += 1;
            } else {
                this.onCourseFG += 1;
            }
        });
    }

    loadParticipants(pThis) {
        for (let i = 0; i < this.focusGroups.length; i++) {
            this.focusGroups[i].participants.forEach(value => {
                if (!pThis.searchParticipant(pThis, value)) {
                    pThis.participants.push(value);
                }
            });
        }
    }

    searchParticipant(pThis, value) {
        let found = false;

        if (pThis.participants.length > 0) {
            pThis.participants.forEach(resp => {
                if (resp.id === value.id) {
                    found = true;
                }
            });
        }

        return found;
    }

    ngOnInit() {
        this.today = moment().format('YYYY-MM-DD');
        this.participants = [];
        this.loadAll();

        this.userService.getUserWithAuthorities().subscribe(user => {
            this.institutionService.getByUserUser(user.id).subscribe(institution => {
                this.institution = institution.body;
                if (this.institution.membership.id == 2) {
                    document.getElementById('footerPremium').innerHTML = '';
                    document.getElementById('footerPremium').innerHTML = '<i class="btn ft-check font-medium-4 p-0"></i>';
                }
                this.aptitudeTestService.findAllByInstitution(institution.body.id).subscribe(aptitudeTests => {
                    this.aptitudeTests = aptitudeTests.body;
                });
            });
        });
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    obtenerPlanPremium() {
        const premium = new Membership(2);

        this.institution.membership = premium;

        this.subscribeToSaveResponse(this.institutionService.update(this.institution));

        document.getElementById('footerPremium').innerHTML = '';
        document.getElementById('footerPremium').innerHTML = '<i class="btn ft-check font-medium-4 p-0"></i>';
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IInstitution>>) {
        result.subscribe((res: HttpResponse<IInstitution>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {}

    protected onSaveError() {}
}
