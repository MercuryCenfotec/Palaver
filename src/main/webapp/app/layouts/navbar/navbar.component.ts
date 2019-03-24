import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import {VERSION} from 'app/app.constants';
import {AccountService, LoginModalService, LoginService, UserService} from 'app/core';
import {ProfileService} from 'app/layouts/profiles/profile.service';
import {IUserApp, UserApp} from 'app/shared/model/user-app.model';

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

    constructor(
        private loginService: LoginService,
        private accountService: AccountService,
        private loginModalService: LoginModalService,
        private profileService: ProfileService,
        private router: Router,
        private userService: UserService
    ) {
        this.version = VERSION ? 'v' + VERSION : '';
        this.isNavbarCollapsed = true;
    }

    ngOnInit() {
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
            this.userService.query().subscribe(tmpUser => {
                for (let k = 0; k < tmpUser.body.length; k++) {
                    if (tmpUser.body[k].id === jhiUser.id) {
                        let permissions: string[] = [];
                        for (let i = 0; i < tmpUser.body[k].authorities.length; i++) {
                            switch (tmpUser.body[k].authorities[i]) {
                                case 'ROLE_ADMIN':
                                    permissions = ['userAppPermissions', 'participantPermissions', 'institutionPermissions',
                                        'incentivePermissions', 'aptitudeTestsPermissions', 'testResultPermissions', 'testQuestionPermissions',
                                        'testAnswerPermissions', 'focusGroupPermissions', 'meetingPermissions', 'membershipPermissions',
                                        'paymentMethodPermissions', 'systemVariablePermissions', 'categoryPermissions', 'balancePermissions',
                                        'paymentPermissions'];
                                    break;
                                case 'ROLE_PARTICIPANT':
                                    permissions = ['paymentMethodPermissions', 'balancePermissions', 'paymentPermissions'];
                                    break;
                                case 'ROLE_INSTITUTION':
                                    permissions = ['incentivePermissions', 'aptitudeTestsPermissions', 'testResultPermissions', 'testQuestionPermissions',
                                        'testAnswerPermissions', 'focusGroupPermissions', 'meetingPermissions', 'membershipPermissions',
                                        'paymentMethodPermissions', 'categoryPermissions', 'balancePermissions', 'paymentPermissions'];
                                    break;
                                case 'ROLE_SUBADMIN':
                                    permissions = ['userAppPermissions', 'participantPermissions', 'institutionPermissions',
                                        'incentivePermissions', 'aptitudeTestsPermissions', 'testResultPermissions', 'testQuestionPermissions',
                                        'testAnswerPermissions', 'focusGroupPermissions', 'meetingPermissions', 'membershipPermissions',
                                        'paymentMethodPermissions', 'systemVariablePermissions', 'categoryPermissions', 'balancePermissions',
                                        'paymentPermissions'];
                                    break;
                                default:
                                    break;
                            }
                        }
                        for (let j = 0; j < permissions.length; j++) {
                            document.getElementById(permissions[j]).hidden = false;
                        }
                    }
                }
            });
        });
    }
}
