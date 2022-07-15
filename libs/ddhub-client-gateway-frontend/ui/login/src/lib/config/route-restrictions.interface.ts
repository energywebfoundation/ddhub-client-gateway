export interface IndexableRouteRestrictions {
  [key: string]: RouteRestriction;
}

export class RouteRestriction {
  allowedRoles: string[] = [];
}

export class RouteRestrictions {
  topicManagement: RouteRestriction = new RouteRestriction();
  myAppsAndTopics: RouteRestriction = new RouteRestriction();
  channelManagement: RouteRestriction = new RouteRestriction();
  largeFileUpload: RouteRestriction = new RouteRestriction();
  largeFileDownload: RouteRestriction = new RouteRestriction();
  fileUpload: RouteRestriction = new RouteRestriction();
  fileDownload: RouteRestriction = new RouteRestriction();
}
