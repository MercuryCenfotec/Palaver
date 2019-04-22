import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Message } from 'app/shared/model/message.model';
import { MessageService } from './message.service';
import { IMessage } from 'app/shared/model/message.model';

@Injectable({ providedIn: 'root' })
export class MessageResolve implements Resolve<IMessage> {
    constructor(private service: MessageService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IMessage> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Message>) => response.ok),
                map((message: HttpResponse<Message>) => message.body)
            );
        }
        return of(new Message());
    }
}

export const messageRoute: Routes = [];
