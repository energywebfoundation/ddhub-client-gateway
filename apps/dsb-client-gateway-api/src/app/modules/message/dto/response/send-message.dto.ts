
import { ApiProperty } from '@nestjs/swagger';


export class Error {

    @ApiProperty({
        description: 'code sent for error',
        type: Number,
        example: 400,
    })
    code: string

    @ApiProperty({
        description: 'reason for failed message',
        type: String,
        example: 'failed due to',
    })
    reason: string

    @ApiProperty({
        description: 'Additional Information for failed message',
        type: Object,
        example: {
            "instancePath": "/nmis",
            "schemaPath": "#/properties/nmis/uniqueItems",
            "keyword": "uniqueItems",
            "params": {
                "i": 2,
                "j": 1
            },
            "message": "must NOT have duplicate items (items ## 1 and 2 are identical)"
        }
    })
    additionalInformation: object

}

export class SendMessageSuccessResponse {

    @ApiProperty({
        description: 'did for which message is sent',
        type: String,
        example: 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
    })
    did: string

    @ApiProperty({
        description: 'message id sent by message broker',
        type: String,
        example: '623c875beaa0422bfc19b1ce',
    })
    messageId: string

    @ApiProperty({
        description: 'message id sent by message broker',
        type: String,
        example: '623c875beaa0422bfc19b1ce',
    })

    @ApiProperty({
        description: 'Status Code sent by message broker',
        type: Number,
        example: 200,
    })
    statusCode: number
}



export class SendMessageFailedResponse {
    @ApiProperty({
        description: 'did for which message is sent',
        type: String,
        example: 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
    })
    did: string

    @ApiProperty({
        description: 'message id sent by message broker',
        type: String,
        example: '623c875beaa0422bfc19b1ce',
    })
    messageId: string

    @ApiProperty({
        description: 'message id sent by message broker',
        type: String,
        example: '623c875beaa0422bfc19b1ce',
    })

    @ApiProperty({
        description: 'Status Code sent by message broker',
        type: Number,
        example: 200,
    })
    statusCode: number

    @ApiProperty({
        description: 'Status Code sent by message broker',
        type: Error,
        example: {
            "code": "DSB::INVALID_PAYLOAD",
            "reason": "payload does not match the schema for the topic",
            "additionalInformation": {
                "instancePath": "/nmis",
                "schemaPath": "#/properties/nmis/uniqueItems",
                "keyword": "uniqueItems",
                "params": {
                    "i": 2,
                    "j": 1
                },
                "message": "must NOT have duplicate items (items ## 1 and 2 are identical)"
            }
        },
    })
    err: Error
}



export class recipients {

    @ApiProperty({
        description: 'total number of recipients',
        type: Number,
        example: 3,
    })
    total: number

    @ApiProperty({
        description: 'total number of recipients for whom message is sent successfully',
        type: Number,
        example: 2,
    })
    sent: number

    @ApiProperty({
        description: 'total number of recipients for whom message is failed',
        type: Number,
        example: 1,
    })
    failed: number
}

export class SendMessagelResponseDto {
    @ApiProperty({
        description: 'client Gateway Message Id',
        type: String,
        example: '0b271eb8-1e21-4817-95af-7951649360ed',
    })
    clientGatewayMessageId: string;

    @ApiProperty({
        description: 'did',
        type: String,
        example: 'did: ethr: volta: 0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
    })
    did: string;

    @ApiProperty({
        description: 'recipients',
        type: () => recipients
    })
    recipients: recipients;

    @ApiProperty({
        description: 'success array of messages sent',
        type: () => [SendMessageSuccessResponse]
    })
    success: SendMessageSuccessResponse[];

    @ApiProperty({
        description: 'failed array of messages sent',
        type: () => [SendMessageFailedResponse]
    })
    failed: SendMessageFailedResponse[];
}

export class GetChannelQualifiedDidsDto {
    @ApiProperty({
        description: 'Channel name / fqcn',
        example: 'channel.name',
        type: String,
    })
    fqcn: string;

    @ApiProperty({
        description: 'List of qualified dids',
        example: [
            'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993',
            'did:ethr:volta:0x3Ce3B60427b4Bf0Ce366d9963BeC5ef3CBD06ad5',
        ],
        type: [String],
    })
    qualifiedDids: string[];

    @ApiProperty({
        description: 'Last update time',
        example: '2022-03-22T14:27:00.027Z',
        type: String,
    })
    updatedAt: string;
}