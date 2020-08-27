import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { DeleteOutlined, EditOutlined } from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router";

const useStyles = makeStyles({
  previewContainer: {
    width: "500px",
    height: "260px",
    borderRadius: "4px",
    boxShadow: "0px 11px 15px -7px rgba(0,0,0,0.2), 0px 9px 46px 8px rgba(0,0,0,0.12), 0px 24px 38px 3px rgba(0,0,0,0.14)",
    padding: "20px 30px",
    position: "relative",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  date: {
    color: "#666",
  },
  time: {
    fontSize: "22px",
  },
  iconPart: {
    position: "absolute",
    top: "15px",
    right: "25px",
  },
  firstIcon: {
    color: "#0e78d5",
    cursor: "pointer",
  },
  lastIcon: {
    color: "red",
    marginLeft: "25px",
    cursor: "pointer",
  },
  lastButton: {
    margin: "0 20px !important",
  },
  buttonPart: {
    textAlign: "right",
    marginTop: "60px",
  },
});

interface InfoProps {
  scheduleId: number;
  handleDelete: () => void;
  handleClose: () => void;
}

export default function CustomizeTempalte(props: InfoProps) {
  const classes = useStyles();
  const history = useHistory();
  const { scheduleId, handleDelete, handleClose } = props;

  const handleEditSchedule = (e: any) => {
    handleClose();
    history.push("/schedule/calendar/rightside/scheduleTable/model/edit");
  };

  return (
    <div className={classes.previewContainer}>
      <div>
        <p className={classes.title}>{"Upgrade Server Hardware"}</p>
        <p className={classes.date}>{"Thursday, Aug 13, 2020"}</p>
        <p className={classes.time}>{"12:00PM - 13:00PM"}</p>
      </div>
      <div className={classes.iconPart}>
        <EditOutlined className={classes.firstIcon} onClick={handleEditSchedule} />
        <DeleteOutlined className={classes.lastIcon} onClick={handleDelete} />
      </div>
      <div className={classes.buttonPart}>
        <Button color="primary" variant="contained">
          Preview in Live
        </Button>
        <Button color="primary" variant="contained" autoFocus className={classes.lastButton}>
          Go Live
        </Button>
      </div>
    </div>
  );
}