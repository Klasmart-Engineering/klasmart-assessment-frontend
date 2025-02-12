import { Replay as ReplayIcon } from "@mui/icons-material";
import { Button, styled, Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import React from "react";
import { FormattedMessage } from "react-intl";
import OopsSvg from "./img/oops.svg";

const ReloadIcon = styled(ReplayIcon)(() => ({
  "&.reload-transform": {
    transform: `rotate(90deg) scale(-1, 1)`,
  },
}));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: `flex`,
      flexDirection: `column`,
      width: `100%`,
      height: `100%`,
      alignItems: `center`,
      justifyContent: `center`,
      padding: `5%`,
    },
    imageLayout: {
      display: `flex`,
      flexDirection: `row`,
      alignItems: `center`,
      padding: `0 20% 0 20%`,
    },
    textLayout: {
      marginLeft: `5%`,
      marginBottom: `5%`,
    },
    tryAgainButton: {},
    image: {
      width: `25%`,
      height: `100%`,
    },
    title: {
      color: theme.palette.primary.main,
      fontSize: 24,
      fontWeight: `bold`,
    },
  })
);

type Props = {
  reload?: () => any | Promise<any>;
};

export default function WidgetWrapperError(props: Props) {
  const classes = useStyles();

  return (
    <>
      <div className={classes.container}>
        <div className={classes.imageLayout}>
          <img src={OopsSvg} alt="" className={classes.image} />
          <div className={classes.textLayout}>
            <div className={classes.title}>
              <FormattedMessage id="home.common.error.generic.title" />
            </div>
            <div>
              <FormattedMessage id="home.common.error.generic.description" />
            </div>
          </div>
        </div>
        {props.reload && (
          <Button
            className={classes.tryAgainButton}
            variant="contained"
            color="secondary"
            endIcon={<ReloadIcon fontSize="small" className="reload-transform" />}
            onClick={() => props.reload && props.reload()}
          >
            <FormattedMessage id="home.common.error.action" />
          </Button>
        )}
      </div>
    </>
  );
}
