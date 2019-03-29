import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import {VERSION} from 'app/app.constants';
import {AccountService, LoginModalService, LoginService, UserService} from 'app/core';
import {ProfileService} from 'app/layouts/profiles/profile.service';
import {IUserApp, UserApp} from 'app/shared/model/user-app.model';
import {IParticipant, Participant} from 'app/shared/model/participant.model';
import {ParticipantService} from 'app/entities/participant';
import {UserAppService} from 'app/entities/user-app';
import {InstitutionService} from 'app/entities/institution';
import {IInstitution, Institution} from 'app/shared/model/institution.model';

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

    constructor(
        private loginService: LoginService,
        private accountService: AccountService,
        private loginModalService: LoginModalService,
        private profileService: ProfileService,
        private participantService: ParticipantService,
        protected userAppService: UserAppService,
        private router: Router,
        private userService: UserService,
        private institutionService: InstitutionService
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
        return this.accountService.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    logout() {
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

    findActualUser() {
        this.currentAccount = this.userService.getUserWithAuthorities().subscribe(jhiUser => {
            if (jhiUser.authorities.includes('ROLE_INSTITUTION') ||
                jhiUser.authorities.includes('ROLE_PARTICIPANT')) {
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
                        'calendarPermissions',
                        'userAppPermissions',
                        'participantPermissions',
                        'institutionPermissions',
                        'incentivePermissions',
                        'aptitudeTestsPermissions',
                        'testResultPermissions',
                        'testQuestionPermissions',
                        'testAnswerPermissions',
                        'focusGroupPermissions',
                        'meetingPermissions',
                        'membershipPermissions',
                        'paymentMethodPermissions',
                        'systemVariablePermissions',
                        'categoryPermissions',
                        'balancePermissions',
                        'paymentPermissions'
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
                        'categoryPermissions',
                        'balancePermissions',
                        'paymentPermissions'
                    ];
                    break;
                case 'ROLE_SUBADMIN':
                    permissions = [
                        'userAppPermissions',
                        'participantPermissions',
                        'institutionPermissions',
                        'incentivePermissions',
                        'aptitudeTestsPermissions',
                        'testResultPermissions',
                        'testQuestionPermissions',
                        'testAnswerPermissions',
                        'focusGroupPermissions',
                        'meetingPermissions',
                        'membershipPermissions',
                        'paymentMethodPermissions',
                        'systemVariablePermissions',
                        'categoryPermissions',
                        'balancePermissions',
                        'paymentPermissions'
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
}
