const header = `
import { IntlFormatters, MessageDescriptor } from "react-intl";

type FormatMessageValue<T> = NonNullable<Parameters<IntlFormatters<T>["formatMessage"]>[1]> extends Record<any, infer V> ? V : never;
export type LangName = "en" | "ko" | "cn" | "vi";

type LangRecord<T = string> =
`

const footer = `
\n
export type LangRecordId = LangRecord["id"];
export type LangRecodeDescription = LangRecord["description"];
export type LangRecordValues = LangRecord["values"];
export type LangRecordIdByDescription<Desc extends LangRecord["description"]> = Extract<
  LangRecord,
  { id: any; description: Desc; values: any }
>["id"];
export type LangeRecordValuesByDesc<Desc extends LangRecord["description"]> = Extract<
  LangRecord,
  { id: any; description: Desc; values: any }
>["values"];
export type LangeRecordValuesById<Id extends LangRecord["id"]> = Extract<LangRecord, { id: Id; description: any; values: any }>["values"];

export interface LangMessageDescriptor extends Omit<MessageDescriptor, "id"> {
  id: LangRecordId;
}
`

function getValuesByDescription(description) {
  const result = description.match(/{.*?}/g);
  if (result == null) return;
  return '{ ' + result.map(x => `${x.slice(1, -1)}: string | number`).join(', ') + ' }';
}

function checkIds(enJson, missJson) {
  const duplicateIds = [];
  const enKeys = Object.keys(enJson);
  Object.keys(missJson).forEach((id) => {
    if (enKeys.includes(id)) duplicateIds.push(id);
  })
  if (duplicateIds.length > 0) throw new Error(`My Error: duplicate id in file both en.json and miss.json: ${duplicateIds.join(', ')}`);
  return true;
}

function genLangTypeFileContent (enJson, missJson) {
  checkIds(enJson, missJson);
  const body = Object.entries(missJson)
    .concat(Object.entries(enJson))
    .map(([id, description]) => `| { id: "${id}"; description: "${description}"; values: ${getValuesByDescription(description)} }`)
    .concat(';')
    .join('\n')

  return `${header}${body}${footer}`;
}

exports.genLangTypeFileContent = genLangTypeFileContent;