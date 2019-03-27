import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IAptitudeTest } from 'app/shared/model/aptitude-test.model';
import { UserService } from 'app/core';

type EntityResponseType = HttpResponse<IAptitudeTest>;
type EntityArrayResponseType = HttpResponse<IAptitudeTest[]>;

@Injectable({ providedIn: 'root' })
export class AptitudeTestService {
    public resourceUrl = SERVER_API_URL + 'api/aptitude-tests';

    constructor(protected http: HttpClient, protected userService: UserService) {}

    create(aptitudeTest: IAptitudeTest): Observable<EntityResponseType> {
        return this.http.post<IAptitudeTest>(this.resourceUrl, aptitudeTest, { observe: 'response' });
    }

    update(aptitudeTest: IAptitudeTest): Observable<EntityResponseType> {
        return this.http.put<IAptitudeTest>(this.resourceUrl, aptitudeTest, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IAptitudeTest>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    findAllByInstitution(institutionId: number): Observable<EntityArrayResponseType> {
        return this.http.get<IAptitudeTest[]>(`${this.resourceUrl}/institution/${institutionId}`, { observe: 'response' });
    }

    findAllAvailableByInstitution(institutionId: number): Observable<EntityArrayResponseType> {
        return this.http.get<IAptitudeTest[]>(`${this.resourceUrl}/institution/available/${institutionId}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IAptitudeTest[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
