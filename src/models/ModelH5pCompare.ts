import isEqual from "lodash/isEqual";

export function formatCompareContent(content: any): any {
  if (content.library) {
    content.subContentId = "";
    content.metadata.authors = [];
    content.metadata.changes = [];
    content.metadata.contentType = "";
    content.metadata.extraTitle = "";
    content.metadata.license = "";
    content.metadata.title = "";
    content.params = formatCompareContent(content.params);
  }
  if (Array.isArray(content)) {
    content = content.map((subContent) => formatCompareContent(subContent));
  }
  if (typeof content === "object") {
    for (const key in content) {
      content[key] = formatCompareContent(content[key]);
    }
  }
  return content;
}

export function formatTargetContent(content: any): any {
  content.metadata = {};
  delete content.h5p;
  return formatCompareContent(content);
}

export function validate(content: any, target: any): boolean | string {
  const currentJSON = formatCompareContent(content);
  const targetJSON = formatTargetContent(target);
  const equal = isEqual(currentJSON, targetJSON);
  if (equal) return true;
  return `本地格式化数据:\n${JSON.stringify(currentJSON, null, 2)}\n\nh5p格式化数据:\n${JSON.stringify(target, null, 2)}`;
}
