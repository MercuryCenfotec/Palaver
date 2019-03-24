import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/core';
import { InstitutionService } from 'app/entities/institution';
import { IInstitution } from 'app/shared/model/institution.model';

@Component({
    selector: 'jhi-dashboard-institution',
    templateUrl: './dashboard-institution.component.html',
    styleUrls: ['./dashboard-institution.component.scss']
})
export class DashboardInstitutionComponent implements OnInit {
    institution: IInstitution;

    constructor(protected userService: UserService, protected institutionService: InstitutionService) {}

    ngOnInit() {
        this.userService.getUserWithAuthorities().subscribe(user => {
            this.institutionService.getByUserUser(user.id).subscribe(institution => {
                this.institution = institution.body;
            });
        });
    }
}
