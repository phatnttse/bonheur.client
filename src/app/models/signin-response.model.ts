import { Gender } from './enums.model';
import { PermissionValues } from './permission.model';

export interface SignInResponse {
  id_token: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface IdToken {
  iat: number;
  exp: number;
  iss: string;
  aud: string | string[];
  sub: string;
  role: string | string[];
  permission: PermissionValues | PermissionValues[];
  name: string;
  email: string;
  fullname: string;
  emailConfirmed: boolean;
  pictureUrl: string;
  gender: Gender;
}
