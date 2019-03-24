export interface IZoomSettings {
    hostVideo?: boolean;
    participantVideo?: boolean;
    cnMeeting?: boolean;
    inMeeting?: boolean;
    joinBeforeHost?: boolean;
    mute_upon_entry?: boolean;
    watermark?: boolean;
    usePmi?: boolean;
    approvalType?: number;
    registrationType?: number;
    audio?: string;
    autoRecording?: string;
    enforceLogin?: boolean;
    enforceLoginDomains?: string;
    alternativeHosts?: string;
}

export class ZoomSettings implements IZoomSettings {
    public hostVideo?: boolean;
    public participantVideo?: boolean;
    public cnMeeting?: boolean;
    public inMeeting?: boolean;
    public joinBeforeHost?: boolean;
    public mute_upon_entry?: boolean;
    public watermark?: boolean;
    public usePmi?: boolean;
    public approvalType?: number;
    public registrationType?: number;
    public audio?: string;
    public autoRecording?: string;
    public enforceLogin?: boolean;
    public enforceLoginDomains?: string;
    public alternativeHosts?: string;
    constructor() {
        this.hostVideo = true;
        this.participantVideo = true;
        this.cnMeeting = true;
        this.inMeeting = false;
        this.joinBeforeHost = false;
        this.mute_upon_entry = false;
        this.watermark = false;
        this.usePmi = true;
        this.approvalType = 2;
        this.registrationType = 1;
        this.audio = 'both';
        this.autoRecording = 'local';
        this.enforceLogin = false;
        this.enforceLoginDomains = '';
        this.alternativeHosts = '';
    }
}
