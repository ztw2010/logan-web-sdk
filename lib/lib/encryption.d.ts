export interface RSACipherOb {
    cipherText: string;
    iv: string;
    secretKey: string;
}
export declare function encryptByRSA(plaintext: string, publicKey: string): RSACipherOb;
