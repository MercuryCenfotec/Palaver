import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPaymentMethod } from 'app/shared/model/payment-method.model';

type EntityResponseType = HttpResponse<IPaymentMethod>;
type EntityArrayResponseType = HttpResponse<IPaymentMethod[]>;

@Injectable({ providedIn: 'root' })
export class PaymentMethodService {
    public resourceUrl = SERVER_API_URL + 'api/payment-methods';

    constructor(protected http: HttpClient) {}

    create(paymentMethod: IPaymentMethod): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(paymentMethod);
        return this.http
            .post<IPaymentMethod>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(paymentMethod: IPaymentMethod): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(paymentMethod);
        return this.http
            .put<IPaymentMethod>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IPaymentMethod>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IPaymentMethod[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(paymentMethod: IPaymentMethod): IPaymentMethod {
        const copy: IPaymentMethod = Object.assign({}, paymentMethod, {
            expirationDate:
                paymentMethod.expirationDate != null && paymentMethod.expirationDate.isValid()
                    ? paymentMethod.expirationDate.format(DATE_FORMAT)
                    : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.expirationDate = res.body.expirationDate != null ? moment(res.body.expirationDate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((paymentMethod: IPaymentMethod) => {
                paymentMethod.expirationDate = paymentMethod.expirationDate != null ? moment(paymentMethod.expirationDate) : null;
            });
        }
        return res;
    }
}
