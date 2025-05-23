export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
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
  PENDING = 'Pending',
  RESPONDED = 'Responded',
  BOOKED = 'Booked',
  DISCARDED = 'Discarded',
}

export enum SupplierStatus {
  PENDING = 'Pending',
  IN_REVIEW = 'InReview',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export enum OnBoardStatus {
  Pending = 'Pending',
  Completed = 'Completed',
}

export enum PaymentStatus {
  CANCELLED = 'CANCELLED',
  PAID = 'PAID',
}

export enum AdType {
  Banner = 'Banner',
  Popup = 'Popup',
  Text = 'Text',
  Video = 'Video',
  Audio = 'Audio',
  Image = 'Image',
  Sidebar = 'Sidebar',
}

export enum AdvertisementStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Expired = 'Expired',
  Rejected = 'Rejected',
}
