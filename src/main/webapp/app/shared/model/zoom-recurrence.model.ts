export interface IZoomRecurrence {
    type?: number;
    repeatInterval?: number;
    weeklyDays?: number;
    monthlyDay?: number;
    monthlyWeek?: number;
    monthlyWeekDay?: number;
    endTimes?: number;
    endDateTime?: Date;
}

export class ZoomRecurrence implements IZoomRecurrence {
    public type?: number;
    public repeat_interval?: number;
    public weeklyDays?: number;
    public monthlyDay?: number;
    public monthlyWeek?: number;
    public monthlyWeekDay?: number;
    public endTimes?: number;
    constructor(public endDateTime?: Date) {
        let endTime = endDateTime;
        endTime.setMinutes(endDateTime.getMinutes() + 41);
        this.type = 1;
        this.repeat_interval = 2;
        this.weeklyDays = 1;
        this.monthlyDay = 1;
        this.monthlyWeek = 2;
        this.monthlyWeekDay = 2;
        this.endTimes = 1;
        this.endDateTime = endDateTime ? endDateTime : endTime;
    }
}
