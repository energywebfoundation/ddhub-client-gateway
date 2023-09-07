import { ApiProperty } from '@nestjs/swagger';

export class GetAllContactsResponseDto {
  @ApiProperty({
    description: 'DID',
    example: 'did:ethr:volta:0x782aB0383Bfc807439d8EE29516937B47815d697',
  })
  public did: string;

  @ApiProperty({
    description: 'Alias',
    example: 'Krzysztof Szostak',
  })
  public alias: string;
}
