import { Button } from "@material-ui/core";
import * as iconv from "iconv-lite";
import { ChangeEvent } from "react";
import { csvToArray, isUTF8 } from "./handledata";

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
          const reader2 = new FileReader();
          reader2.readAsArrayBuffer(rawFile);
          reader2.onload = e => {
            let originData = e.target?.result as string;
            const data = Buffer.from(e.target?.result as string);
            const utf8Data = new Uint8Array(data);
            const isUtf8 = isUTF8(utf8Data)
            if(isUtf8) {
              originData = iconv.decode(data, "utf-8")
            } else {
              originData = iconv.decode(data, "gbk")
            }
            const array = csvToArray(originData);
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