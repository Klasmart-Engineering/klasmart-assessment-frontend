import { createStyles, makeStyles, Tooltip, withStyles } from "@material-ui/core";
import ErrorIcon from '@material-ui/icons/Error';
import { ErrorsInfoProps } from "@pages/OutcomeList/types";
import clsx from "clsx";
const useStyles = makeStyles((theme) => createStyles({
  tableCon: {
    backgroundColor: theme.palette.common.white,
    width: `100%`,
    height: `100%`,
    overflow: `auto`,
  },
  table: {
    borderSpacing: 0,
    borderCollapse: `collapse`,
    // borderLeft: `1px solid ${theme.palette.grey[500]}`,
    // borderTop: `1px solid ${theme.palette.grey[500]}`,
  },
  cellSticky: {
      position: `sticky`,
      top: -1,
      left: -1,
  },
  cellBase: {
    minWidth: 100,
    maxWidth: 175,
    tableLayout : "fixed",
    textAlign: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  topSticky: {
    position: `sticky`,
    top: 0,
    left: 0,
  },
  firstCell: {
    width: 60,
    textAlign: "center",
  },
  fixCell: {
    backgroundColor: "rgb(242, 245, 247)",
    width: 200,
    textAlign: "center",
    paddingTop: "16px",
    paddingBottom: "16px",
    zIndex: 233,
  },
  headCell: {
    minWidth: 100,
    maxWidth: 150,
    textAlign: "center",
  },
  leftCell: {
    textAlign: "left"
  },
  cell: {
    position: "relative",
    boxShadow: `inset -1px -1px 0px #F3F3F3`,
    padding: theme.spacing(1, 2),
    // borderColor: theme.palette.grey[500],
    backgroundColor: theme.palette.common.white,
  },
  errorIcon: {
    position: "absolute",
    top: "5px",
    right: "5px",
  },
  errorItem: {
    backgroundColor: "#FDF2F2"
  },
  rowItem: {
    borderBottom: "1px solid #ccc",
  },
  firstColumn: {
    boxShadow: `inset -1px -1px 0px #F3F3F3`,
  }
}));
const WrappedTextTooltip = withStyles({
  tooltip: {
      whiteSpace: `pre-wrap`,
  },
})(Tooltip);
export interface HeaderType {
  title: string,
  key: string,
}
export interface ItemsType {
  value: boolean | number | string | string[] | undefined,
  error: string,
}
export interface CellType {
  value: boolean | number | string | string[] | undefined,
  error: string | string[],
  items: ItemsType[];
}
export interface RowsItemType {
  [key: string]: CellType | CellType[]
}
export interface FixedTableProps {
  headers: HeaderType[];
  rows: RowsItemType[];
  errorInfo: ErrorsInfoProps;
  requiredColumns: number[];
}
export function FixedTable(props: FixedTableProps) {
  const css = useStyles();
  const { headers, rows, errorInfo } = props;
  return (
    <div className={css.tableCon}>
      <table className={css.table}>
        <thead>
          <tr>
            <th className={clsx(css.cellSticky, css.fixCell, css.firstColumn)} style={{zIndex: 236}}><div className={css.firstCell}>{"Row"}</div></th>
            {
              headers.map((item, i) => {
                const curColumnError = errorInfo.errorColumnsIndex.indexOf(i) >= 0;
                return (
                  <th key={item.title} className={clsx(css.cellSticky, css.fixCell, css.headCell, curColumnError ? css.errorItem : "")}>
                    {item.title}
                  </th>
                )
              })
            }
          </tr>
        </thead>
        <tbody>
            {
              rows.map((row, i) => {
                const curRowError = errorInfo.errorRowsIndex.indexOf(i) >= 0;
                return (
                  <tr key={`row-${i}`} className={css.rowItem}>
                    <td className={clsx(css.cellSticky, css.fixCell, css.firstColumn, curRowError ? css.errorItem : "")}>{row.row_number}</td>
                    {
                      headers.map((item, ii) => {
                        const curRowItem = row[item.key];
                        const isArray = curRowItem instanceof Array;
                        const isObject = curRowItem instanceof Object;
                        const openValue = !isArray ? curRowItem?.value?.toString() : curRowItem;
                        // const open = (isObject && curRowItem.value) ? curRowItem.value.toString().length > 20 : curRowItem.toString().length > 20;
                        // const open  = (isObject) ?  (curRowItem?.value ? curRowItem.value?.toString().length > 20 : curRowItem.toString().length > 20): false;
                        const hasError = 
                          isArray
                          ? 
                          (curRowItem.length ? curRowItem.filter(item => !!item.error).length : false)
                          : 
                          isObject
                          ?
                          curRowItem.items ? !!curRowItem.error
                          :
                          ((curRowItem.error instanceof Array) ? curRowItem.error.filter(item => !!item).length : !!curRowItem.error)
                          :
                          false;
                        const error = 
                          hasError ?
                          (isArray
                          ? 
                          <>
                            {curRowItem.map((e, i) => {
                              const key = JSON.stringify(e.error) + i;
                              return (<div key={key}>{e.error}</div>)
                            })}
                          </>
                          :
                          (curRowItem.error instanceof Array)
                          ? 
                          (curRowItem.error.length ? 
                          <>
                            {curRowItem.error.map((e, i) => {
                              return (<div key={e.toString()+i}>{e}</div>)
                            })}
                          </>
                          : "")
                          : 
                          curRowItem.error)
                          :
                          "";
                        const curColumnError = errorInfo.errorColumnsIndex.indexOf(ii) >= 0;
                        const isError = hasError || curRowError || curColumnError;
                        return (
                          <td key={`${item.key}-${ii}`} className={clsx(css.cell, isError ? css.errorItem : "")}>
                            {!!hasError && <WrappedTextTooltip 
                              title={error} 
                            >
                              <ErrorIcon className={css.errorIcon} color="error"/>
                            </WrappedTextTooltip>}
                            {
                              isArray
                              ?
                              <>
                                {
                                  curRowItem.map((cr, iii) => {
                                    const isObj = cr instanceof Object;
                                    const value = isObj ? cr.value : cr;
                                    const open = value ? value.toString().length > 0 : false
                                    return (
                                      open ? 
                                      <Tooltip title={value as string} placement="top-start" key={`${cr.value+""}-${iii}`}>
                                        <li className={clsx(css.cellBase, css.leftCell)} >
                                          {value}
                                        </li>
                                      </Tooltip>
                                      :
                                      <li className={clsx(css.cellBase, css.leftCell)} key={`${cr.value+""}-${iii}`}>
                                        {value}
                                      </li>
                                    )
                                  })
                                }
                              </>
                              :
                              curRowItem?.items ?
                              <>
                                {
                                  curRowItem.items.map((cr, iii) => {
                                    const isObj = cr instanceof Object;
                                    const value = isObj ? cr.value : cr;
                                    const open = value ? value.toString().length > 0 : false
                                    return (
                                      open ?
                                      <Tooltip title={value as string} placement="top-start" key={`${cr.value+""}-${iii}`}>
                                        <li className={clsx(css.cellBase, css.leftCell)} >
                                          {value}
                                        </li>
                                      </Tooltip>
                                      :
                                      <li className={clsx(css.cellBase, css.leftCell)} key={`${cr.value+""}-${iii}`}>
                                        {value}
                                      </li>
                                    )
                                  })
                                }
                              </>
                              :
                              <>
                                {
                                  (openValue && openValue.toString().length > 0) ?
                                  <Tooltip title={(isObject ? curRowItem.value?.toString() : curRowItem) as string} placement="top-start">
                                    <div className={css.cellBase}>
                                      {
                                        isObject ? curRowItem.value?.toString() : curRowItem
                                      }
                                    </div>
                                  </Tooltip>
                                  :
                                  <div className={css.cellBase}>
                                    {
                                      isObject ? curRowItem.value?.toString() : curRowItem
                                    }
                                  </div>
                                }
                              </>
                            }
                          </td>
                        )
                      })
                    }
                  </tr>
                )
              })
            }
        </tbody>
      </table>
    </div>
  )
}