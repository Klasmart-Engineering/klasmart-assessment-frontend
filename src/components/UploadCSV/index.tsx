import { Button } from "@material-ui/core";
import { ChangeEvent } from "react";


// 只处理逗号列分隔符
const COLUMN_DELIMITER = ',';

export function csvToArray(csv: string): string[][] {
  const table = [] as string[][];
  let row: string[] = [];
  let cell = '';
  let openQuote = false;
  let i = 0;
  
  const pushCell = () => {
    row.push(cell);
    cell = '';
  };
  
  const pushRow = () => {
    pushCell();
    table.push(row);
    row = [];
  }
  // 处理行分隔符和列分隔符
  const handleSeparator = (idx: number) => {
    const c = csv.charAt(idx);
    if (c === COLUMN_DELIMITER) {
      pushCell();
    } else if (c === '\r') {
      if (csv.charAt(idx + 1) === '\n') {
        i++;
      }
      pushRow();
    } else if (c === '\n') {
      pushRow();
    } else {
      return false;
    }
    return true;
  }
  
  while (i < csv.length) {
    const c = csv.charAt(i);
    const next = csv.charAt(i + 1);
    if (!openQuote && !cell && c === '"') {
      // 遇到单元第一个字符为双引号时假设整个单元都是被双引号括起来
        openQuote = true;
    } else if (openQuote) {
      // 双引号还未成对的时候
      if (c !== '"') {
        // 如非双引号，直接添加进单元内容
        cell += c;
      } else if (next === '"') {
        // 处理双引号转义
        cell += c;
        i++;
      } else {
        // 确认单元结束
        openQuote = false
        if (!handleSeparator(++i)){
          throw new Error('Wrong CSV format!');
        }
      }
    } else if (!handleSeparator(i)) {
      // 没有双引号包起来时，如非行列分隔符，一律直接加入单元内容
      cell += c;
    }
    i++;
  }
  if (cell) {
    pushRow();
  }
  return table;
}


export interface CSVObjProps {
  [key: string]: any
}

export interface UploadCSVProps {
  label: string;
  variant?: "text" | "outlined" | "contained" | undefined;
  onUploadSuccess: (headers: string[], array: CSVObjProps[]) => void;
  onUploadFail: () => void;
}
export function UploadCSV(props: UploadCSVProps) {
  const { variant = "contained", label, onUploadSuccess, onUploadFail } = props;
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const rawFile = files && files[0] // only use files[0];
    if(rawFile) {
      if(!rawFile.type.includes("csv")) {
        onUploadFail();
        e.target.files = null;
        e.target.value = "";
      } else {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsText(rawFile);
          reader.onload = e => {
            const data = e.target?.result as string;
            const array = csvToArray(data);
            const headers = array[0].filter(i => !!i);
            const contentsArray: CSVObjProps[] = [];
            array.filter(item => !!(Object.values(item).join("")))
            .forEach(item => {
              const obj: CSVObjProps = {}
              const columns = item;
              const mediaColums = columns.map(cItem => cItem.replace(/\\“/, "").replace(/\t/, "").replace(/"/g, ""))
              const finalColumns = mediaColums.map(item => {
                if(item.indexOf(";") > 0) {
                  return item.split(";")
                } else if(item.indexOf("；") > 0) {
                  return item.split("；")
                } else {
                  return item;
                }
              });
              headers.forEach((item, index) => {
                if(item) {
                  obj[item] = finalColumns[index];
                }
              })
              contentsArray.push(obj)
            })
            resolve({headers, contentsArray});
            onUploadSuccess(headers, contentsArray);
          }
          e.target.files = null;
          e.target.value = "";
        })
      }
    }
  }
  return (
    <label>
      <input style={{ display: "none" }} accept=".csv" type="file" onChange={handleChange} />
      <Button variant={variant} color="primary" component="span">
        {label}
      </Button>
    </label>
  )
}