import { Button, TextField, useMediaQuery, useTheme } from "@material-ui/core";
import React from "react";

interface CustomizeRejectTemplateProps {
  handleClose: () => any;
  handleReject: (reason: string) => void;
}

export default function CustomizeRejectTemplate(props: CustomizeRejectTemplateProps) {
  const { handleClose, handleReject } = props;
  const [reason, setReason] = React.useState("");
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));

  const handleChange = (event: React.ChangeEvent<{ value: any }>) => {
    setReason(event.target.value);
  };

  return (
    <div style={{ width: sm ? "auto" : "400px", padding: "0px 30px 0px 0px" }}>
      <h2 style={{ fontSize: "20px" }}>Edit recurring event</h2>
      <p>Please specify the reason of rejection.</p>
      <div>
        <TextField
          id="standard-basic"
          label="Reason"
          autoFocus
          variant="standard"
          fullWidth
          value={reason}
          onChange={handleChange}
          required
          error={!reason}
        />
      </div>
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <Button color="primary" onClick={handleClose}>
          Cancel
        </Button>
        <Button color="primary" onClick={() => handleReject(reason)}>
          Ok
        </Button>
      </div>
    </div>
  );
}
