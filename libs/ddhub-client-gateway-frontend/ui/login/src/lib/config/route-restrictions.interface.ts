export interface IndexableRouteRestrictions {
  [key: string]: RouteRestriction;
}

export class RouteRestriction {
  protected allowedRoles: string[] = [];
  protected mtlsRequired = false;

  constructor(allowedRoles: string[], mtlsRequired?: boolean) {
    this.allowedRoles = allowedRoles;
    if (mtlsRequired !== undefined) {
      this.mtlsRequired = mtlsRequired;
    }
  }

  public getAllowedRoles(): string[] {
    return this.allowedRoles;
  }

  public getMtlsRequired(): boolean {
    return this.mtlsRequired;
  }
}

export class RouteRestrictions {
  topicManagement: RouteRestriction = new RouteRestriction(
    ['topiccreator'],
    true
  );
  myAppsAndTopics: RouteRestriction = new RouteRestriction(['user']);
  channelManagement: RouteRestriction = new RouteRestriction(['user'], true);
  largeFileUpload: RouteRestriction = new RouteRestriction(['user'], true);
  largeFileDownload: RouteRestriction = new RouteRestriction(['user'], true);
  fileUpload: RouteRestriction = new RouteRestriction(['user'], true);
  fileDownload: RouteRestriction = new RouteRestriction(['user'], true);
}
