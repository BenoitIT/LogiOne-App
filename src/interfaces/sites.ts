export interface NewSite {
  id?: number;
  country?: string;
  locationName?: string;
  siteCode?: string;
  agent?: string | number;
}
export interface newSitesErrors {
  country?: string | null;
  locationName?: string | null;
  agent?: string | null;
  siteCode?: string | null;
}
