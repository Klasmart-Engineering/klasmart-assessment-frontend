import { KeyboardArrowDown } from "@mui/icons-material";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/system";
import { classItem } from "@reducers/myclasseswidget";

interface ISelectClassProps {
  isOpen: boolean;
  classList?: classItem[];
  currentClass: string;
  noClassLabel: string;
  onChange: (event: SelectChangeEvent<any>, child?: React.ReactNode) => void;
  onOpen: (isOpen: boolean) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selectClasses: {
      borderRadius: 10,
      zIndex: 100,
      background: "#fff",
      position: "relative",
      "&>div": {
        "&>span": {
          fontSize: 14,
        },
        "&>span:nth-child(2)": {
          display: "none",
        },
      },
    },
    menuItem: {
      justifyContent: "space-between",
      "&>span:nth-child(1)": {
        marginRight: 10,
      },
      "&>span": {
        fontSize: 14,
      },
      "&.Mui-selected": {
        background: "none",
      },
      "&.Mui-disabled": {
        opacity: 1,
        "&>span:nth-child(1)": {
          opacity: 0.3,
        },
      },
    },
    arrowDownBox: {
      position: "absolute",
      height: "100%",
      right: 10,
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      "&>svg": {
        transition: "transform .5s ease",
      },
    },
    arrowDown: {
      transform: "rotate(-180deg)",
    },
  })
);

export default function SelectClass({ isOpen, classList, currentClass, noClassLabel, onChange, onOpen }: ISelectClassProps) {
  const classes = useStyles();
  return (
    <Select
      size="small"
      fullWidth
      open={isOpen}
      className={classes.selectClasses}
      onOpen={() => onOpen(true)}
      onClose={() => onOpen(false)}
      value={currentClass}
      onChange={onChange}
      IconComponent={() => (
        <div className={classes.arrowDownBox} onClick={() => onOpen(!isOpen)}>
          <KeyboardArrowDown className={isOpen ? classes.arrowDown : undefined} />
        </div>
      )}
    >
      {classList && classList.length > 0 && currentClass !== "no_class" ? (
        classList.map((item) => (
          <MenuItem disabled={item?.class_id === currentClass} className={classes.menuItem} key={item?.class_id} value={item?.class_id}>
            <span>{item?.class_name}</span>
            {item?.schools && item?.schools.length > 0 && <span>{item.schools[0]?.school_name}</span>}
          </MenuItem>
        ))
      ) : (
        <MenuItem value="no_class" disabled>
          {noClassLabel}
        </MenuItem>
      )}
    </Select>
  );
}
