import { Component, OnInit } from '@angular/core';
import { ChartEvent, ChartType } from 'ng-chartist';
import * as Chartist from 'chartist';
import { IUser, UserService } from 'app/core';
import { filter, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IUserApp } from 'app/shared/model/user-app.model';
import { UserAppService } from 'app/entities/user-app';
import { BalanceAccountService } from 'app/entities/balance-account';
import { IBalanceAccount } from 'app/shared/model/balance-account.model';

export interface Chart {
    type: ChartType;
    data: Chartist.IChartistData;
    options?: any;
    responsiveOptions?: any;
    events?: ChartEvent;
}

@Component({
    selector: 'jhi-dashboard-admin',
    templateUrl: './dashboard-admin.component.html',
    styles: []
})
export class DashboardAdminComponent implements OnInit {
    admin: IUser;
    userApps: IUserApp[];
    participants: IUserApp[];
    institutions: IUserApp[];
    subadmins: IUserApp[];
    countPart = 0;
    countInst = 0;
    countSub = 0;
    account: IBalanceAccount;
    BarChart: Chart;

    constructor(
        protected userService: UserService,
        protected userAppService: UserAppService,
        protected accountService: BalanceAccountService
    ) {}

    loadAll() {
        this.userService.getUserWithAuthorities().subscribe(user => {
            this.admin = user;
            this.userAppService.findByUserId(user.id).subscribe(resp => {
                this.accountService.findByUserId(resp.id).subscribe(account => {
                    this.account = account.body;
                });
            });
        });
        this.userAppService
            .query()
            .pipe(
                filter((res: HttpResponse<IUserApp[]>) => res.ok),
                map((res: HttpResponse<IUserApp[]>) => res.body)
            )
            .subscribe((res: IUserApp[]) => {
                this.userApps = res;
                this.loadInfo();
            });
    }

    loadInfo() {
        this.userApps.forEach(resp => {
            if (resp.rol === 'participant') {
                this.participants.push(resp);
                this.countPart += 1;
            } else if (resp.rol === 'institution') {
                this.institutions.push(resp);
                this.countInst += 1;
            } else if (resp.rol === 'subadmin') {
                this.subadmins.push(resp);
                this.countSub += 1;
            }
        });

        //  Bar chart configuration Starts
        this.BarChart = {
            type: 'Bar',
            data: {
                labels: ['', '', ''],
                series: [[this.countPart, this.countInst, this.countSub]]
            },
            options: {
                axisX: {
                    showGrid: false
                },
                axisY: {
                    showGrid: false,
                    showLabel: false,
                    offset: 0
                },
                height: '220px'
            },
            responsiveOptions: [
                [
                    'screen and (max-width: 640px)',
                    {
                        seriesBarDistance: 5,
                        axisX: {
                            labelInterpolationFnc: value => {
                                return value[0];
                            }
                        }
                    }
                ]
            ],
            events: {
                created(data: any): void {
                    const defs = data.svg.elem('defs');
                    defs.elem('linearGradient', {
                        id: 'gradient4',
                        x1: 0,
                        y1: 1,
                        x2: 0,
                        y2: 0
                    })
                        .elem('stop', {
                            offset: 0,
                            'stop-color': 'rgba(238, 9, 121,1)'
                        })
                        .parent()
                        .elem('stop', {
                            offset: 1,
                            'stop-color': 'rgba(255, 106, 0, 1)'
                        });
                    defs.elem('linearGradient', {
                        id: 'gradient5',
                        x1: 0,
                        y1: 1,
                        x2: 0,
                        y2: 0
                    })
                        .elem('stop', {
                            offset: 0,
                            'stop-color': 'rgba(0, 75, 145,1)'
                        })
                        .parent()
                        .elem('stop', {
                            offset: 1,
                            'stop-color': 'rgba(120, 204, 55, 1)'
                        });

                    defs.elem('linearGradient', {
                        id: 'gradient6',
                        x1: 0,
                        y1: 1,
                        x2: 0,
                        y2: 0
                    })
                        .elem('stop', {
                            offset: 0,
                            'stop-color': 'rgba(132, 60, 247,1)'
                        })
                        .parent()
                        .elem('stop', {
                            offset: 1,
                            'stop-color': 'rgba(56, 184, 242, 1)'
                        });
                    defs.elem('linearGradient', {
                        id: 'gradient7',
                        x1: 0,
                        y1: 1,
                        x2: 0,
                        y2: 0
                    })
                        .elem('stop', {
                            offset: 0,
                            'stop-color': 'rgba(155, 60, 183,1)'
                        })
                        .parent()
                        .elem('stop', {
                            offset: 1,
                            'stop-color': 'rgba(255, 57, 111, 1)'
                        });
                },
                draw(data: any): void {
                    if (data.type === 'bar') {
                        data.element.attr({
                            y1: 195,
                            x1: data.x1 + 0.001
                        });
                    }
                }
            }
        };
    }

    ngOnInit() {
        this.participants = [];
        this.institutions = [];
        this.subadmins = [];
        this.loadAll();
    }
}
