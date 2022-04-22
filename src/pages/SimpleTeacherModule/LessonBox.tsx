import { Box, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import LessonUnit from "./LessonUnit";
import TeachingUnit from "./TeachingUnit";
import { getLessonPlan } from "./utils/api";
import vw from "./utils/vw.macro";

const useStyles = makeStyles({
  lessonbox: {
    // width: px2vw(670),
    // height: px2vw(300),
    // backgroundColor: "#C572FF",
    // borderRadius: px2vw(46),
  },
  teachingWrap: {
    marginBottom: vw(47),
  },
  title: {
    fontWeight: 700,
    fontSize: vw(27),
    lineHeight: vw(34),
    marginBottom: vw(19),
  },
});

export default function LessonBox() {
  const css = useStyles();
  // const dispatch = useDispatch();
  useEffect(() => {
    const getLesson = async () => {
      const payload = await getLessonPlan("unit01");
      console.log(payload);
    };
    getLesson();
  });
  return (
    <Box className={css.lessonbox}>
      <Typography className={css.title}>Continue Teaching</Typography>
      <Box className={css.teachingWrap}>
        <TeachingUnit></TeachingUnit>
      </Box>
      <Typography className={css.title}>Unit 1. Teddy Bear, Teddy Bear, Say Goodnight</Typography>
      <LessonUnit></LessonUnit>
    </Box>
  );
}
