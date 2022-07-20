import { Box, CircularProgress, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  loadCon: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function AssetLoading() {
  const css = useStyles();
  return (
    <Box className={css.loadCon}>
      <CircularProgress />
    </Box>
  );
}
