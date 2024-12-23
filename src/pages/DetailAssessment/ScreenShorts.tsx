import { useDownloadMediaForMetadata } from "@kl-engineering/kidsloop-media-hooks";
import { d } from "@locale/LocaleManager";

export interface ScreenShortsProps {
  userId: string;
  roomId: string;
  h5pId: string;
  h5pSubId?: string;
  resourceType?: string;
}
// export function ScreenShorts(props: ScreenShortsProps) {
//   const { userId, roomId, h5pId, h5pSubId, resourceType } = props;
//   // const multipleScreenShorts = ["ArithmeticQuiz", "Flashcards"];
//   const { loading, error, mediaMetadata } = useImageMetadata({
//     userId,
//     roomId,
//     h5pId,
//     h5pSubId: h5pSubId ? h5pSubId : undefined,
//   });
//   const length = mediaMetadata?.length;
//   if (error) {
//     return <p>{d("Server request failed").t("general_error_unknown")}</p>;
//   }
//   if (loading) return <p>Loading ...</p>;
//   if (!length)
//     return <p>{d("Sorry, the screenshot is not available for this lesson material.").t("assessment_detail_screenshot_no_result")}</p>;
//   return (
//     <ImageView
//       resourceType={resourceType}
//       imageId={mediaMetadata[0].id}
//       roomId={roomId as string}
//       mimeType={mediaMetadata[0].mimeType ? mediaMetadata[0].mimeType : "image/jpeg"}
//     />
//   );
// }
//
// export interface ImageViewProps {
//   resourceType?: string;
//   imageId: string;
//   roomId: string;
//   mimeType: string;
// }
// export function ImageView(props: ImageViewProps) {
//   const { imageId, roomId, mimeType } = props;
//   const {
//     loading,
//     error,
//     src: imgSrc,
//   } = useDownloadMedia({
//     mediaId: imageId,
//     roomId,
//     mimeType,
//   });
//   if (loading) return <p>Loading...</p>;
//   if (error) {
//     return <p>{d("Server request failed").t("general_error_unknown")}</p>;
//   }
//   return (
//     <div style={{ width: "100%", height: "auto", marginTop: 10 }}>
//       <img style={{ width: "100%", height: "auto" }} src={imgSrc} alt={"screenshorts"} />
//     </div>
//   );
// }

/**
 * 以下当没有获取到 src 的时候会报错
 * https://local.alpha.kidsloop.net/?org_id=6300b3c5-8936-497e-ba1f-d67164b59c65#/assessments/details?id=62345ccd0fe8a1e7825c7274&assessment_type=OnlineClass
 * **/
export function ScreenShorts(props: ScreenShortsProps) {
  const { userId, roomId, h5pId, h5pSubId } = props;
  // const multipleScreenShorts = ["ArithmeticQuiz", "Flashcards"];
  const { loading, error, src } = useDownloadMediaForMetadata({
    userId,
    roomId,
    h5pId,
    h5pSubId: h5pSubId ? h5pSubId : undefined,
    mediaType: "image",
    mimeType: "image/jpeg",
  });
  if (error) {
    return <p>{d("Server request failed").t("general_error_unknown")}</p>;
  }
  if (loading) return <p>Loading ...</p>;
  if (!src)
    return <p>{d("Sorry, the screenshot is not available for this lesson material.").t("assessment_detail_screenshot_no_result")}</p>;
  return (
    <div style={{ width: "100%", height: "auto", marginTop: 10 }}>
      <img style={{ width: "100%", height: "auto" }} src={src} alt={"screenshorts"} />
    </div>
  );
}
