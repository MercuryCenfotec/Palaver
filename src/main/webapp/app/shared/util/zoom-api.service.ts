import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { IZoomMeeting } from 'app/shared/model/zoom-meeting.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization:
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6ImNLV0F3b1BhUnRXR3RpbHJlWHRKd0EiLCJleHAiOjE1NTY2NzA5MDAsImlhdCI6MTU1MzM4MjM3OX0.te7ASArmW9QXnszHGLxhw9h0V_RcZ0qoVUXTJUIvT4E'
    })
};

@Injectable({ providedIn: 'root' })
export class ZoomApiService {
    public resourceUrl = 'https://api.zoom.us/v2/';

    constructor(protected http: HttpClient) {}

    create(zoomMeeting: IZoomMeeting) {
        this.http
            .post<IZoomMeeting>(`${this.resourceUrl}users/kQhwZBuET_GXqr2jjAk5kA/meetings`, zoomMeeting, httpOptions)
            .subscribe(data => {
                return data;
            });
    }
}
