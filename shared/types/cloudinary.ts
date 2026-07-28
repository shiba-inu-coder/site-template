export type CloudinaryDrawerMode = "checkbox" | "radio" | boolean;
export interface CloudinaryResource {
  created_at: string;
  asset_folder: string;
  asset_id: string;
  filename: string;
  public_id: string;
  format: string;
  alt?: string;
  context: {
    alt: string;
  };
}
export interface CloudinaryPayloadResource {
  alt: string;
  file: string;
  filename: string;
  path: string;
}
export interface CloudinaryFolder {
  external_id: string;
  name: string;
  path: string;
}
export interface CloudinaryApiSignRequestParams {
  filename: string;
  path: string;
  alt: string;
}
export interface CloudinaryApiSignRequestResponse {
  timestamp: number;
  signature: string;
  cloudname: string;
  apikey: string;
  folder: string;
}

export interface CloudinaryFolderCreateParams {
  path: string;
}
export interface CloudinaryFolderDownloadParams {
  path: string;
}
export interface CloudinaryUpdateResourceParams {
  publicId: string;
  options: {
    alt: string;
  };
}
export interface CloudinaryFolderCreateResponse {
  path: string;
  external_id: string;
  name: string;
}

export interface CloudinaryResourceUploadParams {
  filename: string;
  file: string;
  path: string;
  alt: string;
}
export type CloudinaryResourceUploadResponse = CloudinaryResource;

export interface CloudinaryFolderRenameParams {
  oldPath: string;
  newPath: string;
}

export interface CloudinaryFolderRemoveParams {
  path: string;
}

export interface CloudinaryFolderRemoveResponse {
  result: string;
}

export interface CloudinaryResourceRemoveParams {
  public_id: string;
}

export interface CloudinaryResourceRemoveResponse {
  result: string;
}
export interface CloudinaryGetResourcesParams {
  path?: string;
  count?: number;
  nextCursor?: string;
  search?: string;
  type?: "image" | "video";
}

export interface CloudinaryGetFoldersResponse {
  folders: CloudinaryFolder[];
}
export interface CloudinaryGetFoldersParams {
  path: string;
}

export interface CloudinaryGetResourcesResponse {
  resources: CloudinaryResource[];
  next_cursor: string | null;
}
export interface CloudinaryRenameResourcesParams {
  fromPublicId: string;
  toPublicId: string;
}
