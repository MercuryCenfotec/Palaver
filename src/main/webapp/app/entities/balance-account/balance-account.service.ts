import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IBalanceAccount } from 'app/shared/model/balance-account.model';
import { IInstitution } from 'app/shared/model/institution.model';

type EntityResponseType = HttpResponse<IBalanceAccount>;
type EntityArrayResponseType = HttpResponse<IBalanceAccount[]>;

@Injectable({ providedIn: 'root' })
export class BalanceAccountService {
    public resourceUrl = SERVER_API_URL + 'api/balance-accounts';

    constructor(protected http: HttpClient) {}

    create(balanceAccount: IBalanceAccount): Observable<EntityResponseType> {
        return this.http.post<IBalanceAccount>(this.resourceUrl, balanceAccount, { observe: 'response' });
    }

    update(balanceAccount: IBalanceAccount, tokenId: string, amount: number): Observable<EntityResponseType> {
        return this.http.put<IBalanceAccount>(this.resourceUrl + '/' + tokenId + '/' + amount, balanceAccount, { observe: 'response' });
    }

    updateBalance(balanceAccount: IBalanceAccount): Observable<EntityResponseType> {
        return this.http.put<IBalanceAccount>(this.resourceUrl, balanceAccount, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IBalanceAccount>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    findByUserId(id: number): Observable<EntityResponseType> {
        return this.http.get<IBalanceAccount>(`${this.resourceUrl}/user-app/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IBalanceAccount[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
