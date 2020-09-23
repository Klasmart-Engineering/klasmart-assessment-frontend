import { Box, TextField } from "@material-ui/core";
import { makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { CloudDownloadOutlined, CloudUploadOutlined, InfoOutlined } from "@material-ui/icons";
import React from "react";
import { apiResourcePathById } from "../../api/extra";
import ModalBox from "../../components/ModalBox";
import { SingleUploader } from "../../components/SingleUploader";
import { d } from "../../locale/LocaleManager";

const useStyles = makeStyles(() => ({
  fieldset: {
    marginTop: 20,
    width: "100%",
  },
  fieldBox: {
    position: "relative",
  },
  iconField: {
    position: "absolute",
    top: "48%",
    cursor: "pointer",
  },
}));

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: "#FFFFFF",
    maxWidth: 260,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

const tipsText = (
  <div style={{ paddingBottom: "8px" }}>
    <div style={{ color: "#000000", fontWeight: "bold" }}>
      <p>{d("Max").t("schedule_detail_max")}: 10MB</p>
      <span>{d("Support files in").t("schedule_detail_support_files_in")}:</span>
    </div>
    <div style={{ color: "#666666" }}>
      <span>{d("Video").t("schedule_detail_video")} (avi, mov,mp4)</span>
      <br />
      <span>{d("Audio").t("schedule_detail_audio")} (mp3, wav)</span>
      <br />
      <span>{d("Image").t("schedule_detail_image")} (jpg, jpeg, png, gif, bmp)</span>
      <br />
      <span>{d("Document").t("schedule_detail_document")} (doc, docx, ppt, pptx, xls, xlsx, pdf)</span>
    </div>
  </div>
);

const format: string[] = [
  "avi",
  "mov",
  "mp4",
  "mp3",
  "wav",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "doc",
  "docx",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
  "pdf",
];

interface ScheduleAttachmentProps {
  setAttachmentId: (id: string) => void;
  attachmentId: string;
  attachmentName: string;
  setAttachmentName: (name: string) => void;
}

export default function ScheduleAttachment(props: ScheduleAttachmentProps) {
  const { setAttachmentId, attachmentName, setAttachmentName } = props;
  const css = useStyles();
  const handleOnChange = (value: string | undefined): void => {
    if (value) {
      let si = format.some((item) => value.includes(item));
      if (!si) {
        setOpenStatus(true);
        return;
      }
      setAttachmentId(value);
      const url: string | undefined = apiResourcePathById(value);
      setDownloadUrl(url);
    } else {
      setDownloadUrl("");
      setAttachmentId("");
    }
  };

  const getFileName = (name: string): string => {
    let si = format.some((item) => name.includes(item));
    if (!si) {
      setAttachmentName("");
      setAttachmentId("");
      return attachmentName;
    }
    setAttachmentName(name);
    return name;
  };

  const [downloadUrl, setDownloadUrl] = React.useState<string | undefined>("");
  const [openStatus, setOpenStatus] = React.useState(false);

  const modalDate: any = {
    title: "",
    text: d("Please upload the file in the correct format").t("schedule_msg_upload_format"),
    openStatus: openStatus,
    enableCustomization: false,
    buttons: [
      {
        label: d("OK").t("schedule_button_ok"),
        event: () => {
          setOpenStatus(false);
        },
      },
    ],
    handleClose: () => {
      setOpenStatus(false);
    },
  };

  return (
    <>
      <SingleUploader
        partition="schedule_attachment"
        onChange={handleOnChange}
        render={({ uploady, item, btnRef, value, isUploading }) => (
          <Box className={css.fieldBox}>
            <TextField
              disabled
              className={css.fieldset}
              placeholder={d("Attachment").t("schedule_detail_attachment")}
              value={item ? getFileName(item.file.name) : attachmentName}
            ></TextField>
            <HtmlTooltip title={tipsText}>
              <InfoOutlined className={css.iconField} style={{ left: "110px", display: attachmentName ? "none" : "block" }} />
            </HtmlTooltip>
            <input type="file" style={{ display: "none" }} />
            <CloudUploadOutlined className={css.iconField} style={{ right: "10px" }} ref={btnRef as any} />
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
              {attachmentName && <CloudDownloadOutlined className={css.iconField} style={{ right: "50px" }} />}
            </a>
          </Box>
        )}
      />
      <ModalBox modalDate={modalDate} />
    </>
  );
}
