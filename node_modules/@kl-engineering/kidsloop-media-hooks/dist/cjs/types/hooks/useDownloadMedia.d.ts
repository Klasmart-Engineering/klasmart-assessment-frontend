import { ApolloClient } from '@apollo/client';
export interface DownloadMediaHookInput {
    mediaId: string;
    roomId: string;
    mimeType: string;
    client?: ApolloClient<unknown>;
}
export interface DownloadMediaHookOutput {
    src?: string;
    loading?: boolean;
    error?: string;
}
export declare const useDownloadMedia: ({ mediaId, roomId, mimeType, client, }: DownloadMediaHookInput) => DownloadMediaHookOutput;
