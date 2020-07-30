import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Grid, Card, CardMedia, CardActions, CardContent, Typography, IconButton, Collapse, createStyles, styled, Chip, Checkbox, ButtonBase, CardActionArea, Box, Container } from '@material-ui/core';
import { ExpandMore, RemoveCircleOutline, Share, GetApp, CheckBox, CheckBoxOutlineBlank } from '@material-ui/icons';
import LayoutBox from '../../components/LayoutBox';


const calcGridWidth = (n: number, p: number) => n === 1 ? '100%' : `calc(100% * ${n/(n-1+p)})`;

const useStyles = makeStyles((theme) => createStyles({
  gridContainer: {
    [theme.breakpoints.only('xl')]: {
      width: calcGridWidth(4, 0.86),
    },
    [theme.breakpoints.only('lg')]: {
      width: calcGridWidth(4, 0.86),
    },
    [theme.breakpoints.only('md')]: {
      width: calcGridWidth(3, 0.86),
    },
    [theme.breakpoints.only('sm')]: {
      width: calcGridWidth(2, 0.9),
    },
    [theme.breakpoints.only('xs')]: {
      width: calcGridWidth(1, 1),
    },
  },
  card: {
    width: '86%',
    marginBottom: 40,
    [theme.breakpoints.only('sm')]: {
      width: '90%',
    },
    [theme.breakpoints.only('xs')]: {
      width: '100%',
    },
  },
  cardContent: {
    padding: '10px 8px 4px 10px',
  },
  cardMedia: {
    width: '100%',
    paddingTop: '47.6%',
    position: 'relative',
  },
  checkbox: {
    position: 'absolute',
    padding: 0,
    borderRadius: 5,
    top: 10,
    left: 12,
    backgroundColor: 'white',
  },
  cardActions: {
    paddingBottom: 10,
  },
  iconButtonExpandMore: {
    marginLeft: 'auto',
    padding: 2,
    transition: theme.transitions.create('transform'),
  },
  body2: {
    color: '#666',
  },
  previewChip: {
    color: '#0E78D5',
    borderColor: '#0E78D5',
    marginRight: 'auto',
  },
  previewChipLabel: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  removeCircle: {
    color: '#D32F2F',
  },
  share: {
    color: 'black',
  },
  getApp: {
    color: 'black',
  },
  iconButtonBottom: {
    padding: 2,
    marginLeft: 10,
  }
}));


const useExpand = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open)
  return { collapse: { in: open }, expandMore: { open, onClick: toggle }}
}

interface ExpandBtnProps {
  open: boolean;
}
const ExpandBtn = styled(IconButton)((props: ExpandBtnProps) => ({
  transform: props.open ? 'rotate(180deg)' : 'none',
}));

interface ContentCardProps {
  selected: boolean;
}
function ContentCard(props: ContentCardProps) {
  const css = useStyles();
  const expand = useExpand();
  return (
    <Card className={css.card}>
      <CardActionArea>
        <CardMedia className={css.cardMedia} image="https://beta-hub.kidsloop.net/e23a62b86d44c7ae5eb7993dbb6f7d7d.png">
          <Checkbox 
            checked={props.selected} 
            icon={<CheckBoxOutlineBlank viewBox="3 3 18 18"></CheckBoxOutlineBlank>}
            checkedIcon={<CheckBox viewBox="3 3 18 18"></CheckBox>}
            size="small" className={css.checkbox} 
            color="primary"
          ></Checkbox>
        </CardMedia>
      </CardActionArea>
      <CardContent className={css.cardContent}>
        <Grid container>
          <Typography variant="subtitle1">
            Badanamu Zoo: Snow Leopard
          </Typography>
          <ExpandBtn className={css.iconButtonExpandMore} {...expand.expandMore} >
            <ExpandMore fontSize="small"></ExpandMore>
          </ExpandBtn>
        </Grid>
        <Collapse {...expand.collapse} unmountOnExit>
          <Typography className={css.body2} variant="body2">some details</Typography>
        </Collapse>
        <Typography className={css.body2} variant="body2">
          Plan
        </Typography>
      </CardContent>
      <CardActions className={css.cardActions}>
        <Chip clickable label="Preview" variant="outlined" classes={{ root: css.previewChip, label: css.previewChipLabel }}></Chip>
        <IconButton className={clsx(css.removeCircle, css.iconButtonBottom)}>
          <RemoveCircleOutline fontSize="small"></RemoveCircleOutline>
        </IconButton>
        <IconButton className={css.iconButtonBottom}>
          <Share className={css.share} fontSize="small"></Share>
        </IconButton>
        <IconButton className={css.iconButtonBottom}>
          <GetApp className={css.getApp} fontSize="small"></GetApp>
        </IconButton>
      </CardActions>
    </Card>
  )
}

export default function ContentCardList() {
  const css = useStyles();
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <Grid className={css.gridContainer} container>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <ContentCard selected={false}></ContentCard> 
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <ContentCard selected={false}></ContentCard> 
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <ContentCard selected={false}></ContentCard> 
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <ContentCard selected={false}></ContentCard> 
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <ContentCard selected={false}></ContentCard> 
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <ContentCard selected={false}></ContentCard> 
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <ContentCard selected={false}></ContentCard> 
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <ContentCard selected={false}></ContentCard> 
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <ContentCard selected={false}></ContentCard> 
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <ContentCard selected={false}></ContentCard> 
        </Grid>
      </Grid>
    </LayoutBox>
  )
}
