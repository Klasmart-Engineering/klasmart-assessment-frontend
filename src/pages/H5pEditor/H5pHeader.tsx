import { Button, Grid, IconButton, InputBase, makeStyles, Paper, Typography } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import { ContentTypeList } from "../../api/type";

const useStyles = makeStyles((theme) => ({
  header_container: {
    borderBottom: "1px solid #eee",
    paddingBottom: "20px",
    paddingLeft: "20px",
    paddingRight: "10px",
  },
  selectButton: {
    cursor: "pointer",
    border: "1px solid #fff",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  box_selected: {
    marginTop: "0px",
    "& .MuiGrid-item": {
      padding: "10px 0",
    },
    [theme.breakpoints.up("md")]: {
      width: "50%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "40%",
    },
  },
  firstChild: {
    paddingLeft: "20px !important",
  },
  activeLink: {
    textDecoration: "underline",
    border: "1px solid #1a93f4",
    // fontWeight: 700,
  },
  searchBox: {
    width: "100%",
    padding: "5px 20px 5px 20px",
    // paddingLeft: '20px',
    marginTop: "20px",
    border: "2px solid #eee",
    boxShadow: "none",
    borderRadius: "20px",
    position: "relative",
    marginBottom: "10px",
  },
  searchInput: {
    width: "90%",
    fontSize: "20px",
  },
  searchButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
  },
}));

interface H5pHeaderProps {
  contentTypeList: ContentTypeList;
}

export default function H5pHeader(props: H5pHeaderProps) {
  const { contentTypeList } = props;
  const [activeOption, setActiveOption] = React.useState("popularFirst");

  const css = useStyles();

  const handleSelect = (type: string) => {
    setActiveOption(type);
  };

  return (
    <div className={css.header_container}>
      <Grid container style={{ width: "98%" }}>
        <Paper className={css.searchBox}>
          <InputBase
            placeholder="Search for Content Types"
            inputProps={{ "aria-label": "search for Content Types" }}
            className={css.searchInput}
          />
          <IconButton className={css.searchButton} type="submit" aria-label="search">
            <Search />
          </IconButton>
        </Paper>
      </Grid>
      <Grid container alignItems="center">
        <Grid item>
          <Typography variant="h6">All Content Types</Typography>
        </Grid>
        <Grid item>({contentTypeList.length} results)</Grid>
      </Grid>
      <Grid container spacing={5} alignItems="center" className={css.box_selected}>
        <Grid item xs={2} sm={2} md={2} lg={2} xl={2} className={css.firstChild}>
          show:{" "}
        </Grid>
        <Grid item xs={4} sm={3} md={3} lg={3} xl={3}>
          <Button
            className={clsx(css.selectButton, activeOption === "popularFirst" ? css.activeLink : "")}
            onClick={() => handleSelect("popularFirst")}
          >
            Popular First
          </Button>
        </Grid>
        <Grid item xs={4} sm={3} md={3} lg={3} xl={3}>
          <Button
            className={clsx(css.selectButton, activeOption === "NewestFirst" ? css.activeLink : "")}
            onClick={() => handleSelect("NewestFirst")}
          >
            Newest First
          </Button>
        </Grid>
        <Grid item xs={2} sm={3} md={3} lg={3} xl={3}>
          <Button className={clsx(css.selectButton, activeOption === "aToZ" ? css.activeLink : "")} onClick={() => handleSelect("aToZ")}>
            A to Z
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}