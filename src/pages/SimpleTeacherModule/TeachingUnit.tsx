import { Box, Button, Card, CardContent, CardMedia, Grid, makeStyles, Typography, withStyles } from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { StmContext } from "./contexts";
import { pageLinks } from "./index";
import vw from "./utils/vw.macro";

const useStyles = makeStyles({
  teachingUnitWrap: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    fontFamily: "RooneySans",
    fontWeight: "bold",
  },
  teachingunit: {
    fontFamily: "RooneySans",
    display: "flex",
    width: vw(670),
    height: vw(300),
    backgroundColor: "#C572FF",
    borderRadius: vw(46),
    padding: `${vw(19)} 0 ${vw(19)} ${vw(19)}`,
    marginRight: vw(32),
    boxSizing: "border-box",
    borderColor: "none",
    boxShadow: "none",
    "&:hover": {
      transform: "scale(1.08)",
      backgroundColor: "#C572FF",
      borderColor: "none",
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "#C572FF",
      borderColor: "none",
    },
  },
  content: {
    fontFamily: "RooneySans",
    display: "flex",
    width: vw(300),
    flexDirection: "column",
    position: "relative",
  },
  lessoNowrap: {
    height: vw(35),
    lineHeight: vw(35),
    marginBottom: vw(5),
  },
  unitBtn: {
    fontFamily: "RooneySans",
    fontWeight: 800,
    height: vw(35),
    padding: `0 ${vw(10)}`,
    lineHeight: vw(35),
    color: "#C572FF",
    borderRadius: vw(17),
    fontSize: vw(21),
    backgroundColor: "#FFFFFF",
  },
  lessonNo: {
    display: "inline-block",
    fontFamily: "RooneySans",
    fontWeight: 800,
    marginLeft: vw(16),
    color: "#FFFFFF",
    fontSize: vw(29),
  },
  lessonDesp: {
    fontFamily: "RooneySans",
    fontWeight: 700,
    width: "100%",
    marginTop: vw(20),
    fontSize: vw(23),
    lineHeight: vw(27),
    color: "#FFFFFF",
  },
  cover: {
    width: vw(350),
    height: vw(262),
    borderRadius: vw(30),
    backgroundColor: "#C4C4C4",
  },
});
const IconButton = withStyles({
  root: {
    position: "absolute",
    bottom: vw(31),
    left: vw(26),
    fontFamily: "RooneySans",
    fontWeight: 700,
    textAlign: "center",
    background: "#942CE5",
    width: vw(233),
    height: vw(48),
    borderRadius: vw(24),
    cursor: "pointer",
    color: "#FFFFFF",
    "&:hover": {
      background: "#942CE5",
      borderColor: "none",
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "none",
      borderColor: "none",
    },
  },
})(Button);

export default function TeachingUnit(props: { list: ITeachingList[] }) {
  const css = useStyles();
  let history = useHistory();
  const { setRootState, ...rootState } = useContext(StmContext);
  const handleClick = (payload: ITeachingList) => {
    setRootState && setRootState({ ...rootState, planId: payload.id, lessonId: payload.no });
    history.push(pageLinks.present);
  };

  return (
    <Box className={css.teachingUnitWrap}>
      {props.list.map((item: any, index: any) => (
        <Card key={index} className={css.teachingunit}>
          <CardMedia className={css.cover} image={item.thumbnail} title="" />
          <Box className={css.content}>
            <CardContent>
              <Grid container className={css.lessoNowrap} item xs={12} spacing={1}>
                <label className={css.unitBtn}>{item.unitId}</label>
                <span className={css.lessonNo}>Lesson {item.no}</span>
              </Grid>
              <Typography className={css.lessonDesp} component="p">
                {item.name}
              </Typography>
              <IconButton
                onClick={() => {
                  handleClick(item);
                }}
              >
                Continue <ChevronRightIcon></ChevronRightIcon>
              </IconButton>
            </CardContent>
          </Box>
        </Card>
      ))}
    </Box>
  );
}
