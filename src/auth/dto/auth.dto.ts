export class AuthResponseDto {
    userId: number;
    token: string;
    expiresIn: number;
    refreshToken: string;
}
