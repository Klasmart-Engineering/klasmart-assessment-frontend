import { createStyles, makeStyles } from "@mui/styles";
import React from "react";
import Light from "../assets/img/Light.svg";

/** style **/
const useStyles = makeStyles(() =>
  createStyles({
    noDataContent: {
      position: `absolute`,
      width: `100%`,
      height: `calc(100% - 40px)`,
      bottom: 0,
      left: 0,
      // background: "rgba(0, 0, 0, 0.05)",
      borderRadius: `12px`,
      overflow: `hidden`,
    },
    noData: {
      boxSizing: "border-box",
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 343,
      height: 100,
      background: "#FFFFFF",
      borderRadius: "40px 0px 12px 0",
      padding: "28px 30px",
      boxShadow: "0 0 12px #D4D4D4",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    noDataText: {
      fontSize: 16,
      wordBreak: "break-word",
    },
    noDataIcon: {
      width: 18,
      marginRight: 12,
    },
  })
);

interface NoDataMaskProps {
  text: string;
}
export default function NoDataMask({ text }: NoDataMaskProps) {
  const classes = useStyles();

  return (
    <div className={classes.noDataContent}>
      <div className={classes.noData}>
        <img className={classes.noDataIcon} src={Light} alt="" />
        <span className={classes.noDataText}>{text}</span>
      </div>
    </div>
  );
}
