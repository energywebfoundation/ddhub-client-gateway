export interface IndexableRouteRestrictions {
  [key: string]: RouteRestriction;
}

export class RouteRestriction {
  allowedRoles: string[] = [];
  allowedAuthRoles: string[] = [];
}

export class RouteRestrictions {
  gatewaySettings = new RouteRestriction();
  topicManagement = new RouteRestriction();
  myAppsAndTopics = new RouteRestriction();
  channelManagement = new RouteRestriction();
  largeFileUpload = new RouteRestriction();
  largeFileDownload = new RouteRestriction();
  fileUpload = new RouteRestriction();
  fileDownload = new RouteRestriction();
  messageInbox = new RouteRestriction();
  messageOutbox = new RouteRestriction();
  addressBook = new RouteRestriction();
  clientIds = new RouteRestriction();
  integrationApis = new RouteRestriction();
}
