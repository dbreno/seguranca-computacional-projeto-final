import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  // A propriedade 'id' foi removida daqui.

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}