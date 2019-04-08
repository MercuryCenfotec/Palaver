import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Ban } from 'app/shared/model/ban.model';
import { BanService } from './ban.service';
import { BanComponent } from './ban.component';
import { BanDetailComponent } from './ban-detail.component';
import { BanUpdateComponent } from './ban-update.component';
import { BanDeletePopupComponent } from './ban-delete-dialog.component';
import { IBan } from 'app/shared/model/ban.model';

@Injectable({ providedIn: 'root' })
export class BanResolve implements Resolve<IBan> {
    constructor(private service: BanService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IBan> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Ban>) => response.ok),
                map((ban: HttpResponse<Ban>) => ban.body)
            );
        }
        return of(new Ban());
    }
}

export const banRoute: Routes = [
    {
        path: '',
        component: BanComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Bans'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: BanDetailComponent,
        resolve: {
            ban: BanResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Bans'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: BanUpdateComponent,
        resolve: {
            ban: BanResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Bans'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: BanUpdateComponent,
        resolve: {
            ban: BanResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Bans'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const banPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: BanDeletePopupComponent,
        resolve: {
            ban: BanResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Bans'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
