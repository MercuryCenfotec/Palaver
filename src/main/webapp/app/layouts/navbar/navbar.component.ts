import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { VERSION } from 'app/app.constants';
import { AccountService, LoginModalService, LoginService, UserService } from 'app/core';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { IUserApp } from 'app/shared/model/user-app.model';
import { Participant } from 'app/shared/model/participant.model';
import { ParticipantService } from 'app/entities/participant';
import { UserAppService } from 'app/entities/user-app';
import { InstitutionService } from 'app/entities/institution';
import { Institution } from 'app/shared/model/institution.model';
import { IBan } from 'app/shared/model/ban.model';
import { INotification } from 'app/shared/model/notification.model';
import { JhiAlertService } from 'ng-jhipster';
import { FocusGroupService } from 'app/entities/focus-group';
import { BanService } from 'app/entities/ban';
import { NotificationService } from 'app/entities/notification';
import { MeetingService } from 'app/entities/meeting';

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
    membershipId;
    userNotifications: INotification[] = [];
    done = false;
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
        protected jhiAlertService: JhiAlertService,
        protected focusGroupService: FocusGroupService,
        protected banService: BanService,
        protected modalService: NgbModal,
        protected notificationService: NotificationService,
        protected meetingService: MeetingService
    ) {
        this.version = VERSION ? 'v' + VERSION : '';
        this.isNavbarCollapsed = true;
    }

    ngOnInit() {
        this.currentAccount = this.userService.getUserWithAuthorities().forEach(jhiUser => {});

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
        const newNotifications: INotification[] = [];
        localStorage.clear();
        this.userNotifications = newNotifications;
        this.done = false;
        this.collapseNavbar();
        this.loginService.logout();
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
                            this.membershipId = foundInstitution.body.membership.id;
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
                        'paymentPermissions',
                        'banPermissions'
                    ];
                    break;
                case 'ROLE_PARTICIPANT':
                    permissions = [
                        'calendarPermissions',
                        'participantPPermissions',
                        'balancePermissions',
                        'expulsionPermissions',
                        'chatPermissions'
                    ];
                    break;
                case 'ROLE_INSTITUTION':
                    permissions = [
                        'institutionPPermissions',
                        'incentivePermissions',
                        'aptitudeTestsPermissions',
                        'focusGroupPermissions',
                        'membershipPermissions',
                        'balancePermissions'
                    ];
                    break;
                case 'ROLE_SUBADMIN':
                    permissions = ['participantPermissions', 'institutionPermissions', 'banPermissions', 'paymentPermissions'];
                    break;

                case 'ROLE_GROUP':
                    permissions = ['chatPermissions'];
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
                        this.router.navigate(['focus-group/management']);
                        break;
                    default:
                        break;
                }
            }
        });
    }

    getNotifications() {
        if (JSON.parse(localStorage.getItem('notifications')) != null) {
            this.userNotifications = JSON.parse(localStorage.getItem('notifications'));
        }
    }

    doThis() {
        if (this.done === false) {
            const ele = document.getElementById('plsWork');
            const node = document.createElement('DIV');
            node.setAttribute('id', 'notificationContainer');
            for (let i = 0; i < this.userNotifications.length; i++) {
                switch (this.userNotifications[i].type) {
                    case 'GroupAccepted':
                        this.focusGroupService.find(this.userNotifications[i].messageId).subscribe(getIt => {
                            node.innerHTML =
                                node.innerHTML +
                                '<a class="dropdown-item noti-container py-3">\n' +
                                '                                        <i class="ft-thumbs-up success float-left d-block font-large-1 mt-4 mr-4"></i>\n' +
                                '                                        <span class="noti-wrapper">\n' +
                                '                                        <span class="noti-title line-height-1 d-block text-bold-400 success">¡Felicidades!</span>\n' +
                                '                                        <span class="noti-text">Has sido aceptado en el grupo de enfoque:</span><br>\n' +
                                '                                        <span class="noti-text">' +
                                getIt.body.name +
                                '</span>\n' +
                                '                                    </span>\n' +
                                '                                    </a>';
                            ele.appendChild(node);
                        });
                        break;
                    case 'GroupRejected':
                        this.focusGroupService.find(this.userNotifications[i].messageId).subscribe(getIt => {
                            node.innerHTML =
                                node.innerHTML +
                                '<a class="dropdown-item noti-container py-3">\n' +
                                '                                        <i class="ft-user-x danger float-left d-block font-large-1 mt-4 mr-4"></i>\n' +
                                '                                        <span class="noti-wrapper">\n' +
                                '                                        <span class="noti-title line-height-1 d-block text-bold-400 danger">¡Lo sentimos!</span>\n' +
                                '                                        <span class="noti-text">No te aceptaron en el grupo de enfoque:</span><br>\n' +
                                '                                        <span class="noti-text">' +
                                getIt.body.name +
                                '</span>\n' +
                                '                                    </span>\n' +
                                '                                    </a>';
                            ele.appendChild(node);
                        });
                        break;
                    case 'GroupExpulsion':
                        this.banService.find(this.userNotifications[i].messageId).subscribe(getIt => {
                            node.innerHTML =
                                node.innerHTML +
                                '<a class="dropdown-item noti-container py-3">\n' +
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
                        node.innerHTML =
                            node.innerHTML +
                            '<a class="dropdown-item noti-container py-3">\n' +
                            '                                        <i class="ft-video info float-left d-block font-large-1 mt-4 mr-4"></i>\n' +
                            '                                        <span class="noti-wrapper">\n' +
                            '                                        <span class="noti-title line-height-1 d-block text-bold-400 info">¡Videollamada iniciada!</span>\n' +
                            '                                        <span class="noti-text">Ve al calendario para poder unirte.</span>\n' +
                            '                                    </span>\n' +
                            '                                    </a>';
                        ele.appendChild(node);
                        this.meetingService.find(this.userNotifications[i].messageId).subscribe(getIt => {
                            node.innerHTML =
                                node.innerHTML +
                                '<a class="dropdown-item noti-container py-3">\n' +
                                '                                        <i class="ft-video info float-left d-block font-large-1 mt-4 mr-4"></i>\n' +
                                '                                        <span class="noti-wrapper">\n' +
                                '                                        <span class="noti-title line-height-1 d-block text-bold-400 info">¡Videollamada iniciada!</span>\n' +
                                '                                        <span class="noti-text">Ve al calendario para poder unirte a:</span><br>\n' +
                                '                                        <span class="noti-text">' +
                                getIt.body.name +
                                '</span>\n' +
                                '                                    </span>\n' +
                                '                                    </a>';
                            ele.appendChild(node);
                        });
                        break;

                    case 'PaymentDone':
                        node.innerHTML =
                            node.innerHTML +
                            '<a class="dropdown-item noti-container py-3">\n' +
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

    clearAllNotifications() {
        for (let i = 0; i < this.userNotifications.length; i++) {
            this.notificationService.delete(this.userNotifications[i].id).subscribe(deleted => {});
        }
        this.userNotifications = [];
        localStorage.removeItem('notifications');
        const parent = document.getElementById('plsWork');
        const noti = document.getElementById('notificationContainer');
        parent.removeChild(noti);
    }
}
