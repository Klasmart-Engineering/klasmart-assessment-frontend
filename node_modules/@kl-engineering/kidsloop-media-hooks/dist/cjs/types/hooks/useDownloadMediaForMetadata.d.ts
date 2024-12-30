import { ApolloClient } from '@apollo/client';
export interface DownloadMediaForMetadataHookInput {
    userId: string;
    roomId: string;
    h5pId: string;
    h5pSubId?: string;
    mediaType: 'audio' | 'image';
    mimeType: string;
    client?: ApolloClient<unknown>;
}
export interface DownloadMediaForMetadataHookOutput {
    src?: string | null;
    loading?: boolean;
    error?: string;
}
export declare const useDownloadMediaForMetadata: ({ userId, roomId, h5pId, h5pSubId, mediaType, mimeType, client, }: DownloadMediaForMetadataHookInput) => DownloadMediaForMetadataHookOutput;
