import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// O decorator @Injectable indica que esta classe pode ser injetada em outros lugares do código
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // O construtor recebe uma instância do ConfigService para acessar variáveis de ambiente
  constructor(private configService: ConfigService) {
    // Obtém o valor da variável de ambiente 'JWT_SECRET'
    const secret = configService.get<string>('JWT_SECRET');

    // Se o segredo não estiver definido, lança um erro
    if (!secret) {
      throw new Error('JWT_SECRET não foi definido nas variáveis de ambiente');
    }

    // Chama o construtor da classe base (PassportStrategy) com as configurações do JWT
    super({
      // Define que o token JWT será extraído do cabeçalho Authorization no formato Bearer
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Indica que a expiração do token deve ser respeitada
      ignoreExpiration: false,
      // Define a chave secreta usada para validar o token
      secretOrKey: secret,
    });
  }

  // Método chamado automaticamente pelo Passport para validar o payload do token JWT
  async validate(payload: any) {
    // Retorna um objeto contendo informações do usuário
    // Este objeto ficará disponível no request.user das rotas protegidas
    return { userId: payload.sub, username: payload.username };
  }
}