import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class Subscriber<T> {
    protected observable = new Subject<T>();

    public next(item: T) {
        this.observable.next(item);
    }

    public subscribe(callback: (item: T) => void) {
        this.observable.subscribe(callback);
    }
}
