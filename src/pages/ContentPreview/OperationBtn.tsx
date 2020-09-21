import { Box, fade, makeStyles } from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import clsx from "clsx";
import React from "react";
import { EntityContentInfoWithDetails } from "../../api/api.auto";
import { PublishStatus } from "../../api/type";
import { LButton } from "../../components/LButton";
import { d } from "../../locale/LocaleManager";
const ASSETS_NAME = "Assets";

const createContainedColor = (paletteColor: PaletteColor, palette: Palette) => ({
  color: palette.common.white,
  backgroundColor: paletteColor.main,
  "&:hover": {
    backgroundColor: paletteColor.dark,
  },
});

const createOutlinedColor = (paletteColor: PaletteColor, palette: Palette) => ({
  color: paletteColor.main,
  borderColor: paletteColor.light,
  "&:hover": {
    borderColor: paletteColor.main,
    backgroundColor: fade(paletteColor.main, palette.action.hoverOpacity),
  },
});
const useStyles = makeStyles(({ palette }) => ({
  btn: {
    marginLeft: "10px",
    cursor: "pointer",
  },
  rejectBtn: createContainedColor(palette.error, palette),
  approveBtn: createContainedColor(palette.success, palette),
  publistedBtn: createContainedColor(palette.success, palette),
  editBtn: createContainedColor(palette.primary, palette),
  deleteBtn: createOutlinedColor(palette.error, palette),
}));

export interface ActionProps {
  publish_status: EntityContentInfoWithDetails["publish_status"];
  content_type_name?: EntityContentInfoWithDetails["content_type_name"];
  onDelete: () => any;
  onPublish: () => any;
  onApprove: () => any;
  onReject: () => any;
  onEdit: () => any;
}
export function OperationBtn(props: ActionProps) {
  const css = useStyles();
  const { publish_status, content_type_name, onDelete, onPublish, onApprove, onReject, onEdit } = props;
  return (
    <Box display="flex" justifyContent="flex-end">
      {publish_status === PublishStatus.published && (
        <LButton variant="outlined" className={clsx(css.btn, css.deleteBtn)} onClick={onDelete}>
          {d("Remove").t("library_label_remove")}
        </LButton>
      )}
      {(publish_status === PublishStatus.draft ||
        publish_status === PublishStatus.pending ||
        publish_status === PublishStatus.rejected ||
        publish_status === PublishStatus.archive) && (
        <LButton variant="outlined" className={clsx(css.btn, css.deleteBtn)} onClick={onDelete}>
          {d("Delete").t("library_label_delete")}
        </LButton>
      )}
      {publish_status === PublishStatus.pending && (
        <LButton variant="contained" className={clsx(css.btn, css.rejectBtn)} onClick={onReject}>
          {d("Reject").t("library_label_reject")}
        </LButton>
      )}
      {(publish_status === PublishStatus.published ||
        publish_status === PublishStatus.draft ||
        publish_status === PublishStatus.rejected ||
        content_type_name === ASSETS_NAME) && (
        <LButton variant="contained" className={clsx(css.btn, css.editBtn)} onClick={onEdit}>
          {d("Edit").t("library_label_edit")}
        </LButton>
      )}
      {publish_status === PublishStatus.pending && (
        <LButton variant="contained" className={clsx(css.btn, css.approveBtn)} onClick={onApprove}>
          {d("Approve").t("library_label_approve")}
        </LButton>
      )}
      {publish_status === PublishStatus.archive && (
        <LButton variant="contained" className={clsx(css.btn, css.publistedBtn)} onClick={onPublish}>
          {d("Republish").t("library_label_republish")}
        </LButton>
      )}
    </Box>
  );
}
