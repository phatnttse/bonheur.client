export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum StatusCode {
  // Informational responses
  Continue = 'Continue',
  SwitchingProtocols = 'SwitchingProtocols',

  // Success responses
  OK = 'OK',
  Created = 'Created',
  Accepted = 'Accepted',
  NoContent = 'NoContent',

  // Redirection messages
  MovedPermanently = 'MovedPermanently',
  Found = 'Found',
  SeeOther = 'SeeOther',
  NotModified = 'NotModified',

  // Client error responses
  BadRequest = 'BadRequest',
  Unauthorized = 'Unauthorized',
  Forbidden = 'Forbidden',
  NotFound = 'NotFound',
  MethodNotAllowed = 'MethodNotAllowed',
  RequestTimeout = 'RequestTimeout',
  Conflict = 'Conflict',

  // Server error responses
  InternalServerError = 'InternalServerError',
  NotImplemented = 'NotImplemented',
  BadGateway = 'BadGateway',
  ServiceUnavailable = 'ServiceUnavailable',
  GatewayTimeout = 'GatewayTimeout',
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPPLIER = 'SUPPLIER',
}

export enum RequestPricingStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum SupplierStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum OnBoardStatus {
  SUPPLIER_INFO = 'SUPPLIER_INFO',
  SUPPLIER_LOCATION = 'SUPPLIER_LOCATION',
  SUPPLIER_IMAGES = 'SUPPLIER_IMAGES',
  COMPLETED = 'COMPLETED',
}
