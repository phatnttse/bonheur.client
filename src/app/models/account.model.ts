import { BaseResponse, PaginationResponse } from './base.model';
import { Gender } from './enums.model';

export class Account {
  id: string;
  fullName: string;
  partnerName: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  gender: Gender;
  pictureUrl: string;
  roles: string[];
  isEnabled: boolean;
  isLockedOut: boolean;
  lockOutEnd: Date;

  constructor(
    id: string,
    fullName: string,
    partnerName: string,
    email: string,
    emailConfirmed: boolean,
    phoneNumber: string,
    gender: Gender,
    pictureUrl: string,
    roles: string[],
    lockOutEnd: Date
  ) {
    this.id = id;
    this.fullName = fullName;
    this.partnerName = partnerName;
    this.email = email;
    this.emailConfirmed = emailConfirmed;
    this.phoneNumber = phoneNumber;
    this.gender = gender;
    this.pictureUrl = pictureUrl;
    this.roles = roles;
    this.isEnabled = true;
    this.isLockedOut = false;
    this.lockOutEnd = lockOutEnd;
  }
}

export interface SignUpResponse extends BaseResponse<null> {}
export interface ListAccountResponse extends PaginationResponse<Account> {}
export interface BlockAccountResponse extends BaseResponse<null> {}
export interface AccountResponse extends BaseResponse<Account> {}
