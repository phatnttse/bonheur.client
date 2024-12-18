import { BaseResponse, PaginationResponse } from './base.model';
import { Gender } from './enums.model';

export class Account {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  emailConfirmed: boolean;
  gender: Gender;
  pictureUrl: string;
  roles: string[];
  isEnabled: boolean;
  isLockedOut: boolean;

  constructor(
    id: string,
    userName: string,
    fullName: string,
    email: string,
    emailConfirmed: boolean,
    gender: Gender,
    pictureUrl: string,
    roles: string[]
  ) {
    this.id = id;
    this.userName = userName;
    this.fullName = fullName;
    this.email = email;
    this.emailConfirmed = emailConfirmed;
    this.gender = gender;
    this.pictureUrl = pictureUrl;
    this.roles = roles;
    this.isEnabled = true;
    this.isLockedOut = false;
  }
}

export interface SignUpResponse extends BaseResponse<null> {}
export interface ListAccountResponse extends BaseResponse<PaginationResponse<Account>>{}
export interface BlockResponse extends BaseResponse<null>{}
export interface AccountResponse extends BaseResponse<Account>{}
