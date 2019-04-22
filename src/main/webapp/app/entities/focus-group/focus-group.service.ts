import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IFocusGroup } from 'app/shared/model/focus-group.model';

type EntityResponseType = HttpResponse<IFocusGroup>;
type EntityArrayResponseType = HttpResponse<IFocusGroup[]>;

@Injectable({ providedIn: 'root' })
export class FocusGroupService {
    public resourceUrl = SERVER_API_URL + 'api/focus-groups';
    public resourceUrlPublic = SERVER_API_URL + 'api-public/focus-groups';

    constructor(protected http: HttpClient) {}

    create(focusGroup: IFocusGroup): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(focusGroup);
        console.log(focusGroup);
        return this.http
            .post<IFocusGroup>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(focusGroup: IFocusGroup): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(focusGroup);
        return this.http
            .put<IFocusGroup>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IFocusGroup>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    findAllByIncentiveBetwenNow(id: number): Observable<EntityArrayResponseType> {
        return this.http.get<IFocusGroup[]>(`${this.resourceUrl}/find_by_incentive/${id}`, { observe: 'response' });
    }

    findAllByInstitution(institutionId: number): Observable<EntityArrayResponseType> {
        return this.http.get<IFocusGroup[]>(`${this.resourceUrl}/institution/${institutionId}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IFocusGroup[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(focusGroup: IFocusGroup): IFocusGroup {
        const copy: IFocusGroup = Object.assign({}, focusGroup, {
            beginDate: focusGroup.beginDate != null && focusGroup.beginDate.isValid() ? focusGroup.beginDate.format(DATE_FORMAT) : null,
            endDate: focusGroup.endDate != null && focusGroup.endDate.isValid() ? focusGroup.endDate.format(DATE_FORMAT) : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.beginDate = res.body.beginDate != null ? moment(res.body.beginDate) : null;
            res.body.endDate = res.body.endDate != null ? moment(res.body.endDate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((focusGroup: IFocusGroup) => {
                focusGroup.beginDate = focusGroup.beginDate != null ? moment(focusGroup.beginDate) : null;
                focusGroup.endDate = focusGroup.endDate != null ? moment(focusGroup.endDate) : null;
            });
        }
        return res;
    }

    findByCode(code: string): Observable<EntityResponseType> {
        return this.http
            .get<IFocusGroup>(`${this.resourceUrlPublic}/find-by-code/${code}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    findByTest(testId: number): Observable<EntityResponseType> {
        return this.http
            .get<IFocusGroup>(`${this.resourceUrlPublic}/find-by-test/${testId}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    isInProcess(groupId: number): Observable<HttpResponse<boolean>> {
        return this.http.get<boolean>(`${this.resourceUrl}/cancelable/${groupId}`, { observe: 'response' });
    }

    testIsAvailable(testId: number): Observable<HttpResponse<boolean>> {
        return this.http.get<boolean>(`${this.resourceUrl}/aptitude-test/${testId}`, { observe: 'response' });
    }

    findByAptitudeTest(testId: number): Observable<EntityResponseType> {
        return this.http
            .get<IFocusGroup>(`${this.resourceUrl}/aptitude-test/${testId}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    finishFocusGroup(groupId: number): Observable<EntityResponseType> {
        return this.http
            .get<IFocusGroup>(`${this.resourceUrl}/finish/${groupId}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }
}
