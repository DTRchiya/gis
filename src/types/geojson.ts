export interface BoundaryProperties {
  WADMPR: string;
}

export interface GridProperties {
  id: number;
  WADMPR: string;
  WADMKK: string;
  pmiskin_grid: number;
}

export interface BoundaryFeature extends GeoJSON.Feature<GeoJSON.Geometry, BoundaryProperties> {}
export interface GridFeature extends GeoJSON.Feature<GeoJSON.Geometry, GridProperties> {}

export interface BoundaryGeoJSON extends GeoJSON.FeatureCollection<GeoJSON.Geometry, BoundaryProperties> {}
export interface ProvinceGeoJSON extends GeoJSON.FeatureCollection<GeoJSON.Geometry, GridProperties> {}

export type ProvinceCache = Record<string, ProvinceGeoJSON>;

export interface LoadingProgress {
  loaded: number;
  total: number;
  currentProvince: string;
}
