export class LoginCommand {
  constructor(
    public readonly privateKey: string,
    public readonly did: string
  ) {}
}
