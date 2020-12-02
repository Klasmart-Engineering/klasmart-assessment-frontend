import { EntityFolderContent, EntityFolderIdWithFileType } from "../api/api.auto";
import { ContentType, FolderFileTyoe } from "../api/type";

function toHash(contents: EntityFolderContent[], ids: string[]): Record<string, EntityFolderContent> {
  return contents.reduce((result, content) => {
    result[content.id as string] = content;
    return result;
  }, {} as Record<string, EntityFolderContent>);
}

export function ids2removeOrDelete(contents: EntityFolderContent[], ids: string[]) {
  const obj = {
    folder: false,
    planAndMaterial: false,
    bothHave: false,
  };
  if (!ids || ids.length === 0) return obj;
  const arr = ids2Content(contents, ids);
  if (!arr.find((item) => !item)) return obj;
  if (arr && arr.every((item) => item.content_type === ContentType.folder)) {
    obj.folder = true;
    obj.planAndMaterial = false;
    obj.bothHave = false;
  } else if (arr.every((item) => item.content_type === ContentType.plan || item.content_type === ContentType.material)) {
    obj.planAndMaterial = true;
    obj.folder = false;
    obj.bothHave = false;
  } else {
    obj.folder = false;
    obj.planAndMaterial = false;
    obj.bothHave = true;
  }
  return obj;
}

export function ids2Content(contents: EntityFolderContent[], ids: string[]): EntityFolderContent[] {
  const hash = toHash(contents, ids);
  return ids.map((id) => hash[id]);
}

export function content2FileType(contents: EntityFolderContent[] | undefined): EntityFolderIdWithFileType[] {
  if (!contents) return [];
  return contents.map((item) => {
    return {
      folder_file_type: item.content_type === 0 ? FolderFileTyoe.folder : FolderFileTyoe.content,
      id: item.id,
    };
  });
}