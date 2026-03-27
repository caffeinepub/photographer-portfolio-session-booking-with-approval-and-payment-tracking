import { HttpAgent } from "@icp-sdk/core/agent";
import { useCallback } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

/**
 * Uploads a file to blob storage and returns a direct URL.
 * Use this instead of converting images to data URLs for album photos.
 */
export function useStorageUpload() {
  const uploadFile = useCallback(
    async (
      file: File,
      onProgress?: (percentage: number) => void,
    ): Promise<string> => {
      const config = await loadConfig();
      const agent = new HttpAgent({ host: config.backend_host });
      const client = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await client.putFile(bytes, onProgress);
      return client.getDirectURL(hash);
    },
    [],
  );

  return { uploadFile };
}
