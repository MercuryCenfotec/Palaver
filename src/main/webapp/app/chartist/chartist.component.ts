import { Component, OnInit } from '@angular/core';
import { ChartEvent, ChartType } from 'ng-chartist';

const data: any = require('../shared/data/chartist.json');

export interface Chart {
    type: ChartType;
    data: Chartist.IChartistData;
    options?: any;
    responsiveOptions?: any;
    events?: ChartEvent;
}

@Component({
    selector: 'jhi-chartist',
    templateUrl: './chartist.component.html',
    styles: []
})
export class ChartistComponent implements OnInit {
    constructor() {}

    ngOnInit() {}

    barChart1: Chart = {
        type: 'Bar',
        data: data['Bar'],
        options: {
            seriesBarDistance: 21,
            axisX: {
                showGrid: false,
                offset: 100
            }
        },
        responsiveOptions: [
            [
                'screen and (min-width: 640px)',
                {
                    axisX: {
                        labelInterpolationFnc: function(value: number, index: number): string {
                            return index % 4 === 0 ? `W${value}` : null;
                        }
                    }
                }
            ]
        ]
    };
}
