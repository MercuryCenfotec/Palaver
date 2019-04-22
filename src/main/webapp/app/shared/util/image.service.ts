import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class ImageService {
    public resourceUrl = SERVER_API_URL + 'api-public/image';

    constructor(protected http: HttpClient) {}

    save(image: any): Observable<HttpResponse<string>> {
        const formData = new FormData();
        formData.append('file', image, image.name);
        return this.http.post<string>(this.resourceUrl, formData, { observe: 'response' });
    }
}
