import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import {VERSION} from 'app/app.constants';
import {AccountService, IUser, LoginModalService, LoginService, UserService} from 'app/core';
import {ProfileService} from 'app/layouts/profiles/profile.service';
import {IUserApp, UserApp} from 'app/shared/model/user-app.model';
import {IParticipant, Participant} from 'app/shared/model/participant.model';
import {ParticipantService} from 'app/entities/participant';
import {UserAppService} from 'app/entities/user-app';
import {InstitutionService} from 'app/entities/institution';
import {IInstitution, Institution} from 'app/shared/model/institution.model';
import {NotificationService} from "app/entities/notification";
import {tmpdir} from "os";
import {filter, map} from "rxjs/operators";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {IBan} from "app/shared/model/ban.model";
import {INotification} from "app/shared/model/notification.model";
import {JhiAlertService} from "ng-jhipster";
import {FocusGroupService} from "app/entities/focus-group";
import {IFocusGroup} from "app/shared/model/focus-group.model";
import {BanService} from "app/entities/ban";

@Component({
    selector: 'jhi-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['navbar.scss']
})
export class NavbarComponent implements OnInit {
    inProduction: boolean;
    isNavbarCollapsed: boolean;
    languages: any[];
    swaggerEnabled: boolean;
    modalRef: NgbModalRef;
    version: string;
    user: IUserApp;
    currentAccount: any;
    participant = new Participant(null, null, null, null, '', null, null, null);
    institution = new Institution(null, '', '', '', '', null);
    userNotifications: INotification[] = [];
    obt: IFocusGroup;
    done: boolean = false;
    ban: IBan;

    constructor(
        private loginService: LoginService,
        private accountService: AccountService,
        private loginModalService: LoginModalService,
        private profileService: ProfileService,
        private participantService: ParticipantService,
        protected userAppService: UserAppService,
        private router: Router,
        private userService: UserService,
        private institutionService: InstitutionService,
        private notificationService: NotificationService,
        protected jhiAlertService: JhiAlertService,
        protected focusGroupService: FocusGroupService,
        protected banService: BanService,
        protected modalService: NgbModal
    ) {
        this.version = VERSION ? 'v' + VERSION : '';
        this.isNavbarCollapsed = true;
    }

    ngOnInit() {
        this.currentAccount = this.userService.getUserWithAuthorities().forEach(jhiUser => {
        });

        this.profileService.getProfileInfo().then(profileInfo => {
            this.inProduction = profileInfo.inProduction;
            this.swaggerEnabled = profileInfo.swaggerEnabled;
        });
    }

    collapseNavbar() {
        this.isNavbarCollapsed = true;
    }

    isAuthenticated() {
        if (this.accountService.isAuthenticated() === true) {
            this.getNotifications();
        }
        return this.accountService.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    logout() {
        this.collapseNavbar();
        this.loginService.logout();
        localStorage.clear();
        this.router.navigate(['']);
    }

    toggleNavbar() {
        this.isNavbarCollapsed = !this.isNavbarCollapsed;
    }

    getImageUrl() {
        return this.isAuthenticated() ? this.accountService.getImageUrl() : null;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    findActualUser() {
        this.currentAccount = this.userService.getUserWithAuthorities().subscribe(jhiUser => {
            if (jhiUser.authorities.includes('ROLE_INSTITUTION') || jhiUser.authorities.includes('ROLE_PARTICIPANT')) {
                this.userAppService.findByUserId(jhiUser.id).subscribe(userApp => {
                    if (userApp.rol === 'institution') {
                        this.institutionService.getByUserUser(jhiUser.id).subscribe(foundInstitution => {
                            this.institution = foundInstitution.body;
                            this.participant.id = 0;
                        });
                    } else if (userApp.rol === 'participant') {
                        this.participantService.findByUser(userApp.id).subscribe(foundParticipant => {
                            this.participant = foundParticipant;
                            this.institution.id = 0;
                        });
                    }
                });
            }
            this.setPermissions(jhiUser);
        });
    }

    setPermissions(jhiUser) {
        let permissions: string[] = [];
        for (let i = 0; i < jhiUser.authorities.length; i++) {
            switch (jhiUser.authorities[i]) {
                case 'ROLE_ADMIN':
                    permissions = [
                        'userAppPermissions',
                        'participantPermissions',
                        'institutionPermissions',
                        'membershipPermissions',
                        'paymentMethodPermissions',
                        'systemVariablePermissions',
                        'paymentPermissions',
                        'banPermissions'
                    ];
                    break;
                case 'ROLE_PARTICIPANT':
                    permissions = [
                        'calendarPermissions',
                        'participantPPermissions',
                        'paymentMethodPermissions',
                        'balancePermissions',
                        'paymentPermissions'
                    ];
                    break;
                case 'ROLE_INSTITUTION':
                    permissions = [
                        'institutionPPermissions',
                        'incentivePermissions',
                        'aptitudeTestsPermissions',
                        'focusGroupPermissions',
                        'membershipPermissions',
                        'paymentMethodPermissions',
                        'balancePermissions',
                        'paymentPermissions'
                    ];
                    break;
                case 'ROLE_SUBADMIN':
                    permissions = [
                        'participantPermissions',
                        'institutionPermissions',
                        'banPermissions'
                    ];
                    break;
                default:
                    break;
            }
        }
        for (let j = 0; j < permissions.length; j++) {
            document.getElementById(permissions[j]).hidden = false;
        }
    }

    logoRedirection() {
        this.router.navigate(['']);
        this.currentAccount = this.userService.getUserWithAuthorities().subscribe(jhiUser => {
            for (let i = 0; i < jhiUser.authorities.length; i++) {
                switch (jhiUser.authorities[i]) {
                    case 'ROLE_ADMIN':
                        this.router.navigate(['']);
                        break;
                    case 'ROLE_PARTICIPANT':
                        this.router.navigate(['participant-home']);
                        break;
                    case 'ROLE_INSTITUTION':
                        this.router.navigate(['dashboard-institution']);
                        break;
                    case 'ROLE_SUBADMIN':
                        this.router.navigate(['']);
                        break;
                    case 'ROLE_GROUP':
                        this.loginService.logout();
                        this.router.navigate(['']);
                        break;
                    default:
                        break;
                }
            }
        });
    }

    loadAllUserNotifications(user: IUser) {
        this.notificationService
            .findAllNotificationsByUser(user.id.toString())
            .pipe(
                filter((res: HttpResponse<INotification[]>) => res.ok),
                map((res: HttpResponse<INotification[]>) => res.body)
            )
            .subscribe(
                (res: INotification[]) => {
                    this.userNotifications = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    getNotifications() {
        if (JSON.parse(localStorage.getItem("notifications")) != null) {
            this.userNotifications = JSON.parse(localStorage.getItem("notifications"));
        }
    }

    doThis() {
        if (this.done === false) {
            let ele = document.getElementById('plsWork');
            let node = document.createElement('DIV');
            for (let i = 0; i < this.userNotifications.length; i++) {
                switch (this.userNotifications[i].type) {
                    case 'GroupAccepted':
                        this.focusGroupService.find(this.userNotifications[i].messageId).subscribe(getIt => {
                            node.innerHTML = node.innerHTML + '<a class="dropdown-item noti-container py-3">\n' +
                                '                                        <i class="ft-thumbs-up success float-left d-block font-large-1 mt-4 mr-4"></i>\n' +
                                '                                        <span class="noti-wrapper">\n' +
                                '                                        <span class="noti-title line-height-1 d-block text-bold-400 success">¡Felicidades!</span>\n' +
                                '                                        <span class="noti-text">Has sido aceptado en el grupo de enfoque:</span><br>\n' +
                                '                                        <span class="noti-text">' + getIt.body.name + '</span>\n' +
                                '                                    </span>\n' +
                                '                                    </a>';
                            ele.appendChild(node);
                        });
                        break;
                    case 'GroupRejected':
                        this.focusGroupService.find(this.userNotifications[i].messageId).subscribe(getIt => {
                            node.innerHTML = node.innerHTML + '<a class="dropdown-item noti-container py-3">\n' +
                                '                                        <i class="ft-user-x danger float-left d-block font-large-1 mt-4 mr-4"></i>\n' +
                                '                                        <span class="noti-wrapper">\n' +
                                '                                        <span class="noti-title line-height-1 d-block text-bold-400 danger">¡Lo sentimos!</span>\n' +
                                '                                        <span class="noti-text">No te aceptaron en el grupo de enfoque:</span><br>\n' +
                                '                                        <span class="noti-text">' + getIt.body.name + '</span>\n' +
                                '                                    </span>\n' +
                                '                                    </a>';
                            ele.appendChild(node);
                        });
                        break;
                    case 'GroupExpulsion':
                        this.banService.find(this.userNotifications[i].messageId).subscribe(getIt => {
                            node.innerHTML = node.innerHTML + '<a class="dropdown-item noti-container py-3">\n' +
                                '                                        <i class="ft-alert-octagon warning float-left d-block font-large-1 mt-4 mr-4"></i>\n' +
                                '                                        <span class="noti-wrapper">\n' +
                                '                                        <span class="noti-title line-height-1 d-block text-bold-400 warning">¡Lo sentimos!</span>\n' +
                                '                                        <span class="noti-text">Has sido expulsado de un grupo de enfoque.</span><br>\n' +
                                '                                        <span class="noti-text">Ve a la sección de expulsiones para ver el detalle</span>\n' +
                                '                                    </span>\n' +
                                '                                    </a>';
                            ele.appendChild(node);
                        });
                        break;
                    case 'CallStart':
                        node.innerHTML = node.innerHTML + '<a class="dropdown-item noti-container py-3">\n' +
                            '                                        <i class="ft-video info float-left d-block font-large-1 mt-4 mr-4"></i>\n' +
                            '                                        <span class="noti-wrapper">\n' +
                            '                                        <span class="noti-title line-height-1 d-block text-bold-400 info">¡Videollamada iniciada!</span>\n' +
                            '                                        <span class="noti-text">Ve al calendario para poder unirte.</span>\n' +
                            '                                    </span>\n' +
                            '                                    </a>';
                        ele.appendChild(node);
                        break;

                    case 'PaymentDone':
                        node.innerHTML = node.innerHTML + '<a class="dropdown-item noti-container py-3">\n' +
                            '                                        <i class="ft-shopping-cart success float-left d-block font-large-1 mt-4 mr-4"></i>\n' +
                            '                                        <span class="noti-wrapper">\n' +
                            '                                        <span class="noti-title line-height-1 d-block text-bold-400 success">¡Transacción realizada!</span>\n' +
                            '                                        <span class="noti-text">Tienes nuevos fondos en tu cuenta</span>\n' +
                            '                                    </span>\n' +
                            '                                    </a>';
                        ele.appendChild(node);
                        break;
                    default:
                        break;
                }
            }
            this.done = true;
        }
    }

    showMe() {
        debugger
        console.log('Hee hee');
    }
}
