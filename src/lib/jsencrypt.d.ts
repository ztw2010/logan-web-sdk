declare class JsEncrypt {
  public setPublicKey(pubKey: string): void
  public encrypt(str: string): string
  constructor(config?: any)
}

declare module 'jsencrypt' {
  export = JsEncrypt
}
