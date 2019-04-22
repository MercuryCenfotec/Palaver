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
import { Membership } from 'app/shared/model/membership.model';
import { Observable } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BalanceAccountService } from 'app/entities/balance-account';
import { IBalanceAccount } from 'app/shared/model/balance-account.model';
import swal from 'sweetalert2';
import { NavbarComponent } from 'app/layouts';
import { Chart } from 'app/chartist/chartist.component';
import { ChartEvent, ChartType } from 'ng-chartist';
import * as moment from 'moment';
import { Moment } from 'moment';

declare var require: any;

export interface Chart {
    type: ChartType;
    data: Chartist.IChartistData;
    options?: any;
    responsiveOptions?: any;
    events?: ChartEvent;
}

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
    recruitingFG = 0;
    endedFGPer = 0;
    recruitingFGPer = 0;
    onCourseFGPer = 0;
    monthlyGroups = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    account: IBalanceAccount;
    lineArea: Chart;
    donutChart: Chart;

    constructor(
        protected userService: UserService,
        protected institutionService: InstitutionService,
        protected focusGroupService: FocusGroupService,
        protected jhiAlertService: JhiAlertService,
        protected aptitudeTestService: AptitudeTestService,
        protected accountService: BalanceAccountService,
        protected navbarComponent: NavbarComponent
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
            } else if (
                resp.endDate.toString() >= moment().format('YYYY-MM-DD') &&
                resp.beginDate.toString() <= moment().format('YYYY-MM-DD')
            ) {
                this.onCourseFG += 1;
            } else {
                this.recruitingFG += 1;
            }

            for (let i = 0; i < 12; i++) {
                if (moment(resp.beginDate).format('M') == (i + 1).toString()) {
                    this.monthlyGroups[i] += 1;
                }
            }
        });

        this.onCourseFGPer = Math.round((this.onCourseFG / this.focusGroups.length) * 100);
        this.endedFGPer = Math.round((this.endedFG / this.focusGroups.length) * 100);
        this.recruitingFGPer = Math.round((this.recruitingFG / this.focusGroups.length) * 100);

        document.getElementById('oncourseFGPercent').style.width = this.onCourseFGPer + '%';
        document.getElementById('endedFGPercent').style.width = this.endedFGPer + '%';
        document.getElementById('recruitingFGPercent').style.width = this.recruitingFGPer + '%';

        this.donutChart = {
            data: {
                series: [this.onCourseFG, this.endedFG, this.recruitingFG]
            },
            options: {
                donut: true,
                height: '250px',
                donutSolid: true,
                showLabel: false,
                donutWidth: '20%'
            },
            type: 'Pie'
        };

        this.lineArea = {
            type: 'Line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                series: [this.monthlyGroups]
            },
            options: {
                low: 0,
                showArea: true,
                fullWidth: true,
                onlyInteger: true,
                axisY: {
                    low: 0,
                    scaleMinSpace: 50
                },
                axisX: {
                    showGrid: false
                },
                chartPadding: {
                    right: 40
                },
                height: '350px'
            },
            events: {
                created(data: any): void {
                    var defs = data.svg.elem('defs');
                    defs.elem('linearGradient', {
                        id: 'gradient',
                        x1: 0,
                        y1: 1,
                        x2: 1,
                        y2: 0
                    })
                        .elem('stop', {
                            offset: 0,
                            'stop-color': 'rgba(0, 201, 255, 1)'
                        })
                        .parent()
                        .elem('stop', {
                            offset: 1,
                            'stop-color': 'rgba(146, 254, 157, 1)'
                        });

                    defs.elem('linearGradient', {
                        id: 'gradient1',
                        x1: 0,
                        y1: 1,
                        x2: 1,
                        y2: 0
                    })
                        .elem('stop', {
                            offset: 0,
                            'stop-color': 'rgba(132, 60, 247, 1)'
                        })
                        .parent()
                        .elem('stop', {
                            offset: 1,
                            'stop-color': 'rgba(56, 184, 242, 1)'
                        });
                }
            }
        };
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
                this.accountService.findByUserId(institution.body.id).subscribe(account => {
                    this.account = account.body;
                });
            });
        });
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    obtenerPlanPremium() {
        if (this.account != null) {
            if (this.account.balance >= 10000) {
                const premium = new Membership(2);

                this.account.balance -= 10000;
                this.institution.membership = premium;

                this.subscribeToSaveResponse(this.accountService.updateBalance(this.account));
                this.subscribeToSaveResponse(this.institutionService.update(this.institution));

                document.getElementById('footerPremium').innerHTML = '';
                document.getElementById('footerPremium').innerHTML = '<i class="btn ft-check font-medium-4 p-0"></i>';
                this.navbarComponent.ngOnInit();
            } else {
                swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Tu cuenta no tiene los fondos suficientes',
                    footer: '<a href="#/balance-account">¿Recargar cuenta?</a>'
                });
            }
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IInstitution>>) {
        result.subscribe((res: HttpResponse<IInstitution>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {}

    protected onSaveError() {}
}
