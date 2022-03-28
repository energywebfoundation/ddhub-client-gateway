export interface SendMessageSuccessResponse {
    did: string
    messageId: string
    statusCode: number
    err: {
        code: string
        reason: string
        additionalInformation: object
    }
}
export interface SendMessageFailedResponse {
    did: string
    messageId: string
    statusCode: number
    err: {
        code: string
        reason: string
        additionalInformation: object
    }
}

export interface recipients {
    total: number
    sent: number
    failed: number
}

export interface SendInetrnalMessageResponse {
    id: string;
}
export interface SendMessageResponse {
    clientGatewayMessageId: string
    recipients: recipients
    did: string
    success: SendMessageSuccessResponse[]
    failed: SendMessageFailedResponse[]
}