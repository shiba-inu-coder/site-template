export interface ICloudinaryUsecase {
  uploadResource(
    ResourceUploadParams: CloudinaryResourceUploadParams,
  ): Promise<CloudinaryResourceUploadResponse>; // Replace `unknown` with the actual return type

  uploadMultipleResources(
    ResourcesUploadParams: CloudinaryResourceUploadParams[],
  ): Promise<CloudinaryResourceUploadResponse[]>; // Replace `unknown` with the actual return type

  removeResource(
    params: CloudinaryResourceRemoveParams,
  ): Promise<CloudinaryResourceRemoveResponse>;

  renameResource(
    params: CloudinaryRenameResourcesParams,
  ): Promise<CloudinaryResource>;

  getResources(
    params: CloudinaryGetResourcesParams,
  ): Promise<CloudinaryGetResourcesResponse>;

  getFolders(
    params: CloudinaryGetFoldersParams,
  ): Promise<CloudinaryGetFoldersResponse>;
  createFolder(
    params: CloudinaryFolderCreateParams,
  ): Promise<CloudinaryFolderCreateResponse>;
  removeFolder({ path }: CloudinaryFolderRemoveParams): Promise<void>;
  renameFolder(param: CloudinaryFolderRenameParams);
  downloadFolder({ path }: CloudinaryFolderDownloadParams): string;
  updateResource(
    params: CloudinaryUpdateResourceParams,
  ): Promise<CloudinaryResource>;
}
