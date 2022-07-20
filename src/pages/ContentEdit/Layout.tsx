import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { Box, BoxProps, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import React, { Children, ReactNode } from "react";

const maxLeftWidth = (props: LayoutPairProps) => {
  return `calc((100% - ${props.spacing}px) * ${props.leftWidth / (props.leftWidth + props.rightWidth)})`;
};

const maxRightWidth = (props: LayoutPairProps) => {
  return `calc((100% - ${props.spacing}px) * ${props.rightWidth / (props.leftWidth + props.rightWidth)})`;
};

const useStyles = makeStyles((theme: Theme) => ({
  layoutPair: (props: LayoutPairProps) => ({
    display: "flex",
    padding: props.padding,
    [theme.breakpoints.down(props.breakpoint)]: {
      flexDirection: "column",
    },
    [theme.breakpoints.down("sm")]: {
      padding: props.basePadding,
    },
  }),
  layoutLeft: (props: LayoutPairProps) => ({
    flexBasis: props.leftWidth,
    maxWidth: maxLeftWidth(props),
    flexGrow: 1,
    flexShrink: 1,
    marginRight: props.spacing,
    [theme.breakpoints.down(props.breakpoint)]: {
      marginRight: 0,
      marginBottom: 40,
      flexBasis: "100%",
      maxWidth: "none",
    },
  }),
  layoutRight: (props: LayoutPairProps) => ({
    flexBasis: props.rightWidth,
    maxWidth: maxRightWidth(props),
    flexGrow: 1,
    flexShrink: 1,
    [theme.breakpoints.down(props.breakpoint)]: {
      marginBottom: 40,
      flexBasis: "100%",
      maxWidth: "none",
    },
    position: "relative",
  }),
}));

interface LayoutPairProps extends BoxProps {
  breakpoint: Breakpoint | number;
  spacing: number;
  leftWidth: number;
  rightWidth: number;
  basePadding: string | number;
  padding: number;
  children: ReactNode;
}
export default function LayoutPair(props: LayoutPairProps) {
  const { breakpoint, spacing, leftWidth, rightWidth, basePadding, padding, children, ...restProps } = props;
  const css = useStyles(props);
  let index = -1;
  const pairNodes = Children.map(props.children, (child) => {
    index += 1;
    return (
      <Box
        className={clsx({
          [css.layoutLeft]: index === 0,
          [css.layoutRight]: index === 1,
        })}
      >
        {child}
      </Box>
    );
  });
  return (
    <Box className={css.layoutPair} {...restProps}>
      {pairNodes}
    </Box>
  );
}
