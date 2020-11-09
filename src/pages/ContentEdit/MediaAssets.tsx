import { Box, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import React, { useCallback } from "react";
import { useDrag } from "react-dnd";
import { useParams } from "react-router-dom";
import { EntityContentInfoWithDetails } from "../../api/api.auto";
import { PermissionType, usePermission } from "../../components/Permission";
import { SearchcmsList } from "../../components/SearchcmsList";
import { Thumbnail } from "../../components/Thumbnail";
import { TipImages, TipImagesType } from "../../components/TipImages";
import { d } from "../../locale/LocaleManager";

const useStyles = makeStyles(({ breakpoints }) => ({
  mediaAssets: {
    minHeight: 900,
    [breakpoints.down("sm")]: {
      minHeight: 698,
    },
  },
  tableContainer: {
    marginTop: 5,
    maxHeight: 700,
    marginBottom: 20,
  },
  table: {
    minWidth: 700 - 162,
  },
  tableHead: {
    backgroundColor: "#F2F5F7",
  },
  cellThumnbnail: {
    width: 135,
  },
  cellAction: {
    width: 162,
  },
  assetImage: {
    width: 104,
    height: 64,
  },
  emptyImage: {
    marginTop: 200,
    marginBottom: 40,
    width: 200,
    height: 156,
  },
  comingsoonImage: {
    marginTop: 200,
    marginBottom: 40,
    width: 130,
    height: 133,
  },
  noFilesImage: {
    marginTop: 200,
    marginBottom: 40,
    width: 135,
    height: 125,
  },
  emptyDesc: {
    marginBottom: "auto",
  },
  searchField: {
    flexGrow: 2,
    flexShrink: 0.5,
    marginLeft: 40,
  },
  fieldset: {
    minWidth: 110,
    "&:not(:first-child)": {
      marginLeft: 16,
      marginRight: 221,
    },
  },
  pagination: {
    marginBottom: 20,
  },
  paginationUl: {
    justifyContent: "center",
  },
  emptyContainer: {
    textAlign: "center",
  },
}));

interface Asset {
  status: string;
  type: string;
  name: string;
  img: string;
  fileType: string;
  developmental: string;
  skills: string;
  age: string;
  created: string;
  author: string;
}

interface mockAsset {
  type: string;
  name: string;
  developmental: string;
  img: string;
  fileType: string;
  skills: string;
  age: string;
  settings: string;
  status: string;
  created: string;
  author: string;
  action: string;
}

interface DraggableItemProps {
  type: string;
  item: EntityContentInfoWithDetails;
  lesson?: "assets" | "material" | "plan";
}
function DraggableImage(props: DraggableItemProps) {
  const { type, item, lesson } = props;
  const css = useStyles();
  const editbales = usePermission([
    PermissionType.edit_lesson_plan_content_238,
    PermissionType.edit_lesson_material_metadata_and_content_236,
  ]);
  const editbale = editbales.edit_lesson_material_metadata_and_content_236 || editbales.edit_lesson_plan_content_238;
  const [, dragRef] = useDrag({ item: { type, data: item }, canDrag: () => editbale });
  const contentType =
    lesson === "material"
      ? item.content_type && Number(item.content_type * 10 + (JSON.parse(item.data || JSON.stringify({ file_type: "" })).file_type || 1))
      : item.content_type;
  return <Thumbnail key={item.id} ref={dragRef} className={css.assetImage} alt="pic" id={item.thumbnail} type={contentType} />;
}

export interface MediaAssetsProps {
  list: EntityContentInfoWithDetails[];
  total: number;
  amountPerPage?: number;
  comingsoon?: boolean;
  value?: string;
  onSearch: (searchText: MediaAssetsProps["value"]) => any;
  onChangePage: (page: number) => any;
  mediaPage: number;
}
export default function MediaAssets(props: MediaAssetsProps) {
  const { lesson } = useParams();
  const css = useStyles();
  const { list, comingsoon, value, onSearch, total, amountPerPage = 10, onChangePage, mediaPage } = props;
  const handChangePage = useCallback(
    (event: object, page: number) => {
      onChangePage(page);
    },
    [onChangePage]
  );

  const rows = list?.map((item, idx) => (
    <TableRow key={idx}>
      <TableCell className={css.cellThumnbnail}>
        <DraggableImage type="LIBRARY_ITEM" item={item} lesson={lesson} />
      </TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.author_name}</TableCell>
      {/* <TableCell className={css.cellAction}>
        <Button color="primary" variant="contained">
          Select
        </Button>
      </TableCell> */}
    </TableRow>
  ));
  const table = (
    <>
      <TableContainer className={css.tableContainer}>
        <Table className={css.table} stickyHeader>
          <TableHead className={css.tableHead}>
            <TableRow>
              <TableCell className={css.cellThumnbnail}>{d("Thumbnail").t("library_label_thumbnail")}</TableCell>
              <TableCell>
                {lesson === "plan" ? d("Material Name").t("library_label_material_name") : d("Asset Name").t("library_label_asset_name")}
              </TableCell>
              <TableCell>{d("Author").t("library_label_author")}</TableCell>
              {/* <TableCell className={css.cellAction}>{d("Actions").t('assess_label_actions')}</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </TableContainer>
      <Pagination
        page={mediaPage}
        className={css.pagination}
        classes={{ ul: css.paginationUl }}
        onChange={handChangePage}
        count={Math.ceil(total / amountPerPage)}
        color="primary"
      />
    </>
  );
  return (
    <Box className={css.mediaAssets} display="flex" flexDirection="column" alignItems="center">
      {comingsoon && lesson !== "plan" ? (
        <TipImages text="library_msg_coming_soon" type={TipImagesType.commingSoon} />
      ) : (
        <>
          <SearchcmsList searchName="searchMedia" onSearch={onSearch} value={value} />
          {list.length > 0 ? table : <TipImages text="library_msg_no_results_found" type={TipImagesType.noResults} />}
        </>
      )}
    </Box>
  );
}
