import { ApiProperty } from '@nestjs/swagger';

export class UserDetailsDto {
  @ApiProperty({ example: 'john_doe', description: 'Username of the user' })
  username: string;

  @ApiProperty({ example: 'P@ssw0rd123', description: 'User password (hashed in DB, plain for input)' })
  password: string;

  @ApiProperty({ example: 'admin', description: 'Role of the user', enum: ['admin', 'user', 'viewer'] })
  role: string;
}
