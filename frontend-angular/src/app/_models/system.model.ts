
export interface SystemMessage {
    message: string,
    messageType: SystemMessageType,
    noTimeOut: boolean,
    timeUntilDestruction: number,
}

export interface Confirmation {
    text: string,
    id: string | number
}

export interface ConfirmationResponse {
    confirmValue: boolean,
    id: string | number
}

export enum SystemMessageType{
    SUCCESS = 1,
    ERROR = 2,
    WARNING = 3,
    NOTIFICATION = 4
}
