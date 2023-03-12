import * as crypto from "crypto";

export type UrlParseResult = {
  url?: string,
  error?: any
}

export function getUrlListFromEnvOrThrow(variableName:string) :string[] {
  const urlList = getEnvVarOrThrow(variableName);
  const parsedUrls = parseUrlList(urlList);
  const errors = parsedUrls.filter(o => o.error);
  if (errors.length > 0) {
    throw new Error(`Invalid URL(s) in the '${variableName}' environment variable: ${errors.map((o) => o.error.message).join(", ")}`);
  }
  return parsedUrls.map(o => o.url ?? "");
}

export function getEnvVarOrThrow (name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not set.`);
  }
  return value;
}

export function parseUrlList(urlList:string, separator:string = ",") : UrlParseResult[] {
  const parts = urlList.split(separator);
  const result: UrlParseResult[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    try {
      new URL(part);
      result.push({url: part});
    } catch (error) {
      result.push({error});
    }
  }
  return result;
}

export function isEthereumAddress(address?:string) {
  if (!address?.startsWith('0x')) {
    return false;
  }

  if (address.length !== 42) {
    return false;
  }

  const hexChars = '0123456789abcdefABCDEF';
  for (let i = 2; i < address.length; i++) {
    if (hexChars.indexOf(address[i]) === -1) {
      return false;
    }
  }

  return true;
}

export function getRandomHexNumber(length:number = 16) {
  const randomBytes = crypto.randomBytes(length);
  let randomNumber = '';
  for (let i = 0; i < length; i++) {
    randomNumber += randomBytes[i].toString(16).padStart(2, '0');
  }
  return randomNumber;
}
