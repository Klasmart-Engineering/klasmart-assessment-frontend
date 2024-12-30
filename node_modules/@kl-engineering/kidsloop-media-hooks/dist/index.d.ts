/// <reference types="react" />
import { ApolloClient } from '@apollo/client';

interface DownloadMediaHookInput {
    mediaId: string;
    roomId: string;
    mimeType: string;
    client?: ApolloClient<unknown>;
}
interface DownloadMediaHookOutput {
    src?: string;
    loading?: boolean;
    error?: string;
}
declare const useDownloadMedia: ({ mediaId, roomId, mimeType, client, }: DownloadMediaHookInput) => DownloadMediaHookOutput;

interface DownloadMediaForMetadataHookInput {
    userId: string;
    roomId: string;
    h5pId: string;
    h5pSubId?: string;
    mediaType: 'audio' | 'image';
    mimeType: string;
    client?: ApolloClient<unknown>;
}
interface DownloadMediaForMetadataHookOutput {
    src?: string | null;
    loading?: boolean;
    error?: string;
}
declare const useDownloadMediaForMetadata: ({ userId, roomId, h5pId, h5pSubId, mediaType, mimeType, client, }: DownloadMediaForMetadataHookInput) => DownloadMediaForMetadataHookOutput;

interface MediaMetadataHookInput {
    userId: string;
    roomId: string;
    h5pId: string;
    h5pSubId?: string;
    client?: ApolloClient<unknown>;
}
interface MediaMetadataHookOutput {
    loading: boolean;
    error?: any;
    mediaMetadata?: MediaMetadataItem[];
}
interface MediaMetadataItem {
    id: string;
    userId: string;
    roomId?: string;
    h5pId: string;
    h5pSubId?: string;
    description: string;
    mimeType: string;
    createdAt: string | any;
}

declare const useAudioMetadata: ({ userId, roomId, h5pId, h5pSubId, client, }: MediaMetadataHookInput) => MediaMetadataHookOutput;

declare const useImageMetadata: ({ userId, roomId, h5pId, h5pSubId, client, }: MediaMetadataHookInput) => MediaMetadataHookOutput;

declare const AudioPlayer: ({ mediaId, roomId, mimeType, client, }: DownloadMediaHookInput) => JSX.Element;

declare const AudioMetadataList: ({ userId, roomId, h5pId, h5pSubId, client, }: MediaMetadataHookInput) => JSX.Element;

export { AudioMetadataList, AudioPlayer, DownloadMediaForMetadataHookInput, DownloadMediaForMetadataHookOutput, DownloadMediaHookInput, DownloadMediaHookOutput, MediaMetadataHookInput, MediaMetadataHookOutput, MediaMetadataItem, useAudioMetadata, useDownloadMedia, useDownloadMediaForMetadata, useImageMetadata };
