import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IIncentive } from 'app/shared/model/incentive.model';

type EntityResponseType = HttpResponse<IIncentive>;
type EntityArrayResponseType = HttpResponse<IIncentive[]>;

@Injectable({ providedIn: 'root' })
export class IncentiveService {
    public resourceUrl = SERVER_API_URL + 'api/incentives';

    constructor(protected http: HttpClient) {}

    create(incentive: IIncentive): Observable<EntityResponseType> {
        return this.http.post<IIncentive>(this.resourceUrl, incentive, { observe: 'response' });
    }

    update(incentive: IIncentive): Observable<EntityResponseType> {
        return this.http.put<IIncentive>(this.resourceUrl, incentive, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IIncentive>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IIncentive[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
