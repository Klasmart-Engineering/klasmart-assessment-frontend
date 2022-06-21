import { CSVObjProps } from "@components/UploadCSV";
import { OutcomeFromCSVFirstProps, OutcomeHeadersProps } from "@pages/OutcomeList/types";
import { ApiPullOutcomeSetResponse, ModelOutcomeDetailView } from "../api/api.auto";
import { GetOutcomeDetail, OutcomeSetResult } from "../api/type";

export const modelOutcomeDetail = (outcomeDetail: ModelOutcomeDetailView) => {
  const afterData = JSON.parse(JSON.stringify(outcomeDetail));
  const { program, subject, developmental, skills, age, grade } = outcomeDetail;
  if (program && program.length) {
    afterData.program = program.map((item: any) => item.program_id);
    afterData.program = afterData.program.filter((item: string) => item);
  }
  if (subject && subject.length) {
    afterData.subject = subject.map((item: any) => item.subject_id);
    afterData.subject = afterData.subject.filter((item: string) => item);
  }
  if (developmental && developmental.length) {
    afterData.developmental = developmental.map((item: any) => item.developmental_id);
    afterData.developmental = afterData.developmental.filter((item: string) => item);
  }
  if (skills && skills.length) {
    afterData.skills = skills.map((item: any) => item.skill_id);
    afterData.skills = afterData.skills.filter((item: string) => item);
  }
  if (age && age.length) {
    afterData.age = age.map((item: any) => item.age_id);
    afterData.age = afterData.age.filter((item: string) => item);
  }
  if (grade && grade.length) {
    afterData.grade = grade.map((item: any) => item.grade_id);
    afterData.grade = afterData.grade.filter((item: string) => item);
  }
  return afterData;
};

export const ids2OutcomeSet = (ids: string[], outComeSets: ApiPullOutcomeSetResponse["sets"]): OutcomeSetResult => {
  if (!ids || !ids.length || !outComeSets || !outComeSets.length) return [];
  return outComeSets.filter((item) => ids.indexOf(item.set_id as string) >= 0);
};

export const findSetIndex = (id: string, outComeSets: ApiPullOutcomeSetResponse["sets"]): number => {
  if (!id || !outComeSets || !outComeSets.length) return -1;
  return outComeSets.findIndex((item) => item.set_id === id);
};

export const excluedOutcomeSet = (ids: string[], outComeSets: ApiPullOutcomeSetResponse["sets"]) => {
  if (!ids || !ids.length || !outComeSets || !outComeSets.length) return ids;
  const selectedIds = outComeSets.map((item) => item.set_id);
  selectedIds.forEach((item) => {
    const index = ids.indexOf(item as string);
    if (index >= 0) {
      ids.splice(index, 1);
    }
  });
  return ids;
};

export const isAllMineOutcome = (ids: string[], outcomeList: GetOutcomeDetail[], user_id: string) => {
  const selectedOutcome = outcomeList.filter((item) => ids.indexOf(item.outcome_id as string) >= 0);
  const index = selectedOutcome.findIndex((item) => item.author_id !== user_id);
  return !(index >= 0);
};

export function formattedNowOrTime(value?: number): string {
  let date = value ? new Date(Number(value) * 1000) : new Date();
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  const MMs = MM < 10 ? `0${MM}` : MM;
  let d = date.getDate();
  const ds = d < 10 ? `0${d}` : d;
  let h = date.getHours();
  const hs = h < 10 ? `0${h}` : h;
  let m = date.getMinutes();
  const ms = m < 10 ? `0${m}` : m;
  return `${y}${MMs}${ds}${hs}${ms}`;
}

export const timestampToTime = (timestamp: number | undefined, type: string = "default") => {
  if (!timestamp) return ``;
  const date = new Date(Number(timestamp) * 1000);
  const dateNumFun = (num: number) => (num < 10 ? `0${num}` : num);
  const [Y, M, D, h, m] = [
    date.getFullYear(),
    dateNumFun(date.getMonth() + 1),
    dateNumFun(date.getDate()),
    dateNumFun(date.getHours()),
    dateNumFun(date.getMinutes()),
    dateNumFun(date.getSeconds()),
  ];
  return `${Y}-${M}-${D} ${h}:${m}`;
};

export function formattedTime(value: number | undefined): string {
  if (value) {
    let date = new Date(Number(value) * 1000);
    let y = date.getFullYear();
    let MM = date.getMonth() + 1;
    const MMs = MM < 10 ? `0${MM}` : MM;
    let d = date.getDate();
    const ds = d < 10 ? `0${d}` : d;
    let h = date.getHours();
    const dayType = h >= 12 ? "PM" : "AM";
    h = h > 12 ? h - 12 : h;
    const hs = h < 10 ? `0${h}` : h;
    let m = date.getMinutes();
    const ms = m < 10 ? `0${m}` : m;
    return `${y}/${MMs}/${ds}  ${hs}:${ms}${dayType}`;
  }
  return "";
}

enum Type {
  date = "date",
  time = "time",
}

export function formatTimeToEng(seconds: number, type?: string) {
  if (!seconds) return "";
  const date = new Date(seconds * 1000);
  const year = date.getFullYear();
  const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Spt", "Oct", "Nov", "Dec"];
  const month = monthArr[date.getMonth()];
  const day = date.getDate();
  const h = date.getHours();
  const dayType = h > 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h;
  const min = date.getMinutes();
  if (type === Type.date) {
    return `${month}  ${day},  ${year}`;
  }
  if (type === Type.time) {
    return `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")} ${dayType}`;
  }
}

export function formattedDate(value: number | undefined): string {
  if (value) {
    let date = new Date(Number(value) * 1000);
    let y = date.getFullYear();
    let MM = date.getMonth() + 1;
    const MMs = MM < 10 ? `0${MM}` : MM;
    let d = date.getDate();
    const ds = d < 10 ? `0${d}` : d;
    return `${y}/${MMs}/${ds}`;
  }
  return "";
}

export function formattedMonthDay(): string {
  let date = new Date();
  let MM = date.getMonth() + 1;
  const MMs = MM < 10 ? `0${MM}` : MM;
  let d = date.getDate();
  const ds = d < 10 ? `0${d}` : d;
  return `${MMs}${ds}`;
}
export function stringToArray(value: string | string[]): string[] {
  if(value instanceof Array) {
    return value;
  } else if(value){
    return [value.trim()]
  } else {
    return []
  }
}
export function arrayToString(value: string | string[]) {
  if(value instanceof Array) {
    return value.join(";");
  } else if(value) {
    return value.trim();
  }
}

export function transferCSVToOutcome(header: string[], array: CSVObjProps[]): {headers: OutcomeHeadersProps[], loArray: OutcomeFromCSVFirstProps[]} {
  const loKeyValue = {
    outcome_name: "Learning Outcome Name",
    shortcode: "Short Code",//
    assumed: "Assumed",
    score_threshold: "Score Threshold",
    program: "Program",
    subject: "Subject",
    category: "Category",
    subcategory: "Subcategory",
    sets: "Learning Outcome Set",//
    age: "Age",
    grade: "Grade",
    keywords: "Keywords",
    description: "Description",
    author: "Author",
    updated_at: "Created On",
    milestones: "Milestones",//
  }
  const n_headers = header.filter(item => !!item)
  const headers = n_headers.map(item => {
    const loKeyValues = Object.entries(loKeyValue);
    const curValus = loKeyValues.find((values) => values[1] === item);
    return {
      title: item,
      key: (curValus ? curValus[0] : "") as string
    }
  });
  const newArray = array.filter((lo, index) => index !== 0);
  const loArray = newArray.map((item, i) => {
        return {
          row_number: i + 2,
          outcome_name: item[loKeyValue.outcome_name]?.trim() as string,
          shortcode: item[loKeyValue.shortcode]?.trim() as string,
          assumed: item[loKeyValue.assumed]?.trim() as string,
          score_threshold: item[loKeyValue.score_threshold]?.trim() as string,
          program: arrayToString(item[loKeyValue.program]),
          subject: stringToArray(item[loKeyValue.subject]),
          category: arrayToString(item[loKeyValue.category]),
          subcategory: stringToArray(item[loKeyValue.subcategory]),
          sets: stringToArray(item[loKeyValue.sets]),
          age: stringToArray(item[loKeyValue.age]),
          grade: stringToArray(item[loKeyValue.grade]),
          keywords: stringToArray(item[loKeyValue.keywords]),
          description: arrayToString(item[loKeyValue.description]) as string,
          author: item[loKeyValue.author]?.trim() as string,
          updated_at: item[loKeyValue.updated_at]?.trim() as string,
          milestones: stringToArray(item[loKeyValue.milestones]),
        }
      });
  return { headers, loArray };
}
