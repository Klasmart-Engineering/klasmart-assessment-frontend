import { Box, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { Fragment, ReactNode } from "react";
import AnyTimeNoData from "../../assets/icons/any_time_no_data.png";
import comingsoonIconUrl from "../../assets/icons/coming soon.svg";
import emptyIconUrl from "../../assets/icons/empty.svg";
import noFilesIconUrl from "../../assets/icons/nofiles.svg";
import achievementEmptyUrl from "../../assets/icons/noLearningOutcomes.svg";
import noReportUrl from "../../assets/icons/noReport.svg";
import noPermissionUrl from "../../assets/icons/permission.jpg";
import { d, t } from "../../locale/LocaleManager";

const useStyles = makeStyles((theme: Theme) => ({
  emptyImage: {
    marginTop: 200,
    marginBottom: 40,
    display: "inline-block",
    [theme.breakpoints.down("md")]: {
      marginTop: 40,
      marginBottom: 20,
    },
  },
  emptyDesc: {
    marginBottom: "auto",
  },
  emptyContainer: {
    textAlign: "center",
  },
}));

export enum TipImagesType {
  empty = "empty",
  commingSoon = "commingSoon",
  noResults = "noResults",
  noPermission = "noPermission",
  achievementEmpty = "achievementEmpty",
  noReport = "noReport",
}
export type TextLabel =
  | "library_msg_no_results_found"
  | "library_label_empty"
  | "library_msg_coming_soon"
  | "library_error_no_permissions"
  | "report_msg_no_data"
  | "report_msg_no_plan"
  | "report_label_no_report";
interface TipImagesProps {
  type: TipImagesType;
  text?: TextLabel;
  children?: ReactNode;
}
export function TipImages(props: TipImagesProps) {
  const { type, text, children } = props;
  const css = useStyles();
  let src = "";
  if (type === TipImagesType.empty) {
    src = emptyIconUrl;
  }
  if (type === TipImagesType.commingSoon) {
    src = comingsoonIconUrl;
  }
  if (type === TipImagesType.noResults) {
    src = noFilesIconUrl;
  }
  if (type === TipImagesType.noPermission) {
    src = noPermissionUrl;
  }
  if (type === TipImagesType.achievementEmpty) {
    src = achievementEmptyUrl;
  }
  if (type === TipImagesType.noReport) {
    src = noReportUrl;
  }
  return (
    <Fragment>
      <Box className={css.emptyContainer}>
        <img className={css.emptyImage} alt={type} src={src} />
        {text && (
          <Typography className={css.emptyDesc} variant="body1" color="textSecondary">
            {t(text)}
          </Typography>
        )}
        {children}
      </Box>
    </Fragment>
  );
}
export const permissionTip = <TipImages type={TipImagesType.noPermission} text="library_error_no_permissions" />;
export const emptyTip = <TipImages type={TipImagesType.empty} text="library_label_empty" />;
export const comingsoonTip = <TipImages type={TipImagesType.commingSoon} text="library_msg_coming_soon" />;
export const resultsTip = <TipImages type={TipImagesType.noResults} text="library_msg_no_results_found" />;
export const achievementEmpty = <TipImages type={TipImagesType.achievementEmpty} text="report_msg_no_data" />;
export const emptyTipAndCreate = <TipImages type={TipImagesType.empty} text="report_msg_no_plan" />;

export const noReportTip = <TipImages type={TipImagesType.noReport} text="report_label_no_report" />;

export function NoOutcome() {
  const css = useStyles();
  return (
    <div style={{ width: "100%", textAlign: "center", margin: "10vh auto" }}>
      <img className={css.emptyImage} src={AnyTimeNoData} alt="" />
      <p>{d("No learning outcome is available.").t("assess_msg_no_lo")}</p>
    </div>
  );
}
