import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})

export class EncryptService {
  KEY = 'vnt@25$#@$^@1ERF';
  VI = '25@vnt$#@$^@1ERF';
  constructor() { }
  //The set method is use for encrypt the value.
  encrypt(value) {
    const key = CryptoJS.enc.Utf8.parse(this.KEY);
    const iv = CryptoJS.enc.Utf8.parse(this.VI);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
  }

  //The get method is use for decrypt the value.
  decrypt(value) {
    const key = CryptoJS.enc.Utf8.parse(this.KEY);
    const iv = CryptoJS.enc.Utf8.parse(this.VI);
    const decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
