import { Button } from "@material-ui/core";
import { trim } from "lodash";
import { ChangeEvent } from "react";

export interface CSVObjProps {
  [key: string]: any
}

export interface UploadCSVProps {
  label: string;
  onUploadSuccess: (headers: string[], array: CSVObjProps[]) => void;
  onUploadFail: () => void;
}
export function UploadCSV(props: UploadCSVProps) {
  const { label, onUploadSuccess, onUploadFail } = props;
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
            const data = trim(e.target?.result as string);
            const array = data.split(/[\n]/);
            const headers = array[0].trim().split(",").filter(i => !!i);
            const contentsArray: CSVObjProps[] = [];
            array.filter((i, index) => index > 0)
            .filter(item => !!(Object.values(item).join("")))
            .forEach(item => {
              const obj: CSVObjProps = {}
              const columns = item.trim().split(/,s*(?![^"]*",)/);
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
      <Button variant="contained" color="primary" component="span">
        {label}
      </Button>
    </label>
  )
}