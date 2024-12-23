import { gql } from "@apollo/client";
import { ProgramsObjProps, SubjectObjProps } from "@pages/OutcomeList/types";
import { LinkedMockOptionsItem } from "@reducers/contentEdit/programsHandler";
import { store } from "@reducers/index";
import { FileLike } from "@rpldy/shared";
import Cookies from "js-cookie";
import uniq from "lodash/uniq";
import api, { gqlapi } from ".";
// import requireContentType from "../../scripts/contentType.macro";
import { LangRecordId } from "../locale/lang/type";
import { ICacheData } from "../services/permissionCahceService";
import { ConnectionDirection } from "./api-ko-schema.auto";
import { EntityFolderItemInfo } from "./api.auto";
import { apiEmitter, ApiErrorEventData, ApiEvent } from "./emitter";

// 每个接口都有塞给后端的参数 以及前端 url 上的参数名
export const ORG_ID_KEY = "org_id";
export const LOCALE_KEY = "locale";
export const PERMISSION_KEY = "perm";

export const apiGetMockOptions = () =>
  fetch("https://launch.kidsloop.cn/static/mock-korea-data/select-options.json").then((res) => {
    return res.json();
  });
export interface MockOptionsItem {
  id?: string;
  name?: string;
}

export interface MockOptionsItemTeacherAndClass {
  teacher_id: string;
  class_ids: string[];
}

export interface MockOptionsOptionsDevelopmentalItem extends MockOptionsItem {
  skills: MockOptionsItem[];
}

export interface MockOptionsOptionsItem {
  program: MockOptionsItem;
  subject: MockOptionsItem[];
  developmental: MockOptionsOptionsDevelopmentalItem[];
  age: MockOptionsItem[];
  grade: MockOptionsItem[];
}

export interface MockOptions {
  options: MockOptionsOptionsItem[];
  visibility_settings: MockOptionsItem[];
  lesson_types: MockOptionsItem[];
  classes: MockOptionsItem[];
  class_types: MockOptionsItem[];
  organizations: MockOptionsItem[];
  teachers: MockOptionsItem[];
  students: MockOptionsItem[];
  users: MockOptionsItem[];
  teacher_class_relationship: MockOptionsItemTeacherAndClass[];
}
export interface ValidationStatus {
  key: string;
  validationComplete: boolean;
  valid?: boolean; // undefined when still validating
  totalPages?: number; // undefined when the PDF document is completely invalid or corrupted and no page data is available
  pagesValidated?: number; // undefined when totalPages is undefined
}

function getWebsocketApi() {
  if (!process.env.REACT_APP_KO_BASE_API) return "";
  const url = decodeURIComponent(process.env.REACT_APP_KO_BASE_API);
  if (!url.includes("https")) return "";
  return url.replace("https", "wss");
}
const DOMAIN = getWebsocketApi();

export const apiResourcePathById = (resource_id?: string) => {
  if (!resource_id) return;
  return `${process.env.REACT_APP_BASE_DOMAIN}/v1/contents_resources/${resource_id}`;
};

export const getPicRealPath = async (resource_id?: string) => {
  const res = await api.contentsResources.getDownloadPath(resource_id as string)
  return res.path;
}

export const apiWebSocketValidatePDFById = (source: string, onChangePercentage?: (percentage: number) => any) => {
  return new Promise((resolve: (data: ValidationStatus) => any, reject: () => any) => {
    if (!DOMAIN) {
      reject();
    }
    const [prefix, id] = source.split("-");
    const ws = new WebSocket(`${DOMAIN}/pdf/v2/${prefix}/${id}/validate`);
    ws.addEventListener("open", async () => {
      ws.send(id);
    });
    ws.addEventListener("message", (messageEvent) => {
      const data = JSON.parse(messageEvent.data);
      const percentage = Math.floor((data.pagesValidated / data.totalPages) * 100);
      onChangePercentage?.(percentage);
      if (data.validationComplete) {
        resolve(data);
        ws.close();
      }
    });
    ws.addEventListener("error", reject);
  });
};
export const apiWebSocketValidatePDF = (file: FileLike, onChangePercentage?: (percentage: number) => any) => {
  return new Promise((resolve: (data: ValidationStatus) => any, reject: () => any) => {
    if (!DOMAIN) {
      reject();
    }
    const ws = new WebSocket(`${DOMAIN}/pdf/v2/validate`);
    ws.binaryType = "arraybuffer";
    ws.addEventListener("open", async () => {
      const files = file as unknown as Blob;
      const data = files.arrayBuffer();
      ws.send(await data);
    });
    ws.addEventListener("message", (messageEvent) => {
      const data = JSON.parse(messageEvent.data);
      const percentage = Math.floor((data.pagesValidated / data.totalPages) * 100);
      onChangePercentage?.(percentage);
      if (data.validationComplete) {
        resolve(data);
        ws.close();
      }
    });
    ws.addEventListener("error", reject);
  });
};

export const apiGenH5pResourceByToken = (token: string, sub: string, content_id?: string) => {
  // return `${process.env.REACT_APP_H5P_API}/h5p/token/${token}`;
  return `${process.env.REACT_APP_H5P_API}/h5p/action/${sub}/${content_id}?h5ptoken=${token}`;
};

export const apiLivePath = (token: string) => {
  return `${process.env.REACT_APP_LIVE_LINK}?token=${token}`;
};

export const apiFetchClassByTeacher = (mockOptions: MockOptions, teacher_id: string) => {
  if (mockOptions.teacher_class_relationship.length) {
    const class_ids = mockOptions.teacher_class_relationship.filter(
      (item: MockOptionsItemTeacherAndClass) => item.teacher_id === teacher_id
    )[0].class_ids;
    return mockOptions.classes.filter((item: MockOptionsItem) => class_ids.filter((item1: string) => item.id === item1).length > 0);
  }
};

export const apiDownloadPageUrl = (href?: string, fileName?: string) => {
  if (!href) return;
  const { origin } = new URL(href);
  const downloadUrl = `${origin}/download.html?download=${encodeURIComponent(fileName ?? "")}&href=${encodeURIComponent(href)}`;
  return downloadUrl;
};

export const apiOrganizationOfPage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return store.getState().common.organization_id || searchParams.get(ORG_ID_KEY);
};

export const getDocumentUrl = (router: string) => {
  const { origin, search } = document.location;
  return `${origin}/${search}#/${router}`;
};

export const apiWaitForOrganizationOfPage = (): Promise<string> => {
  const errorLabel: LangRecordId = "general_error_no_organization";
  // const infoLabel: LangRecordId = "general_info_waiting_orgnization_info";
  const TIME_OUT = 3600 * 1000;
  // const INFO_INTERVAL = 10 * 1000;
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const orgId = apiOrganizationOfPage();
    if (orgId) return resolve(orgId);
    // const infoTimer = setInterval(() => {
    //   apiEmitter.emit<ApiErrorEventData>(ApiEvent.Info, { label: infoLabel });
    // }, INFO_INTERVAL)
    const timer = setInterval(() => {
      if (Date.now() - startTime > TIME_OUT) {
        clearInterval(timer);
        // clearInterval(infoTimer);
        apiEmitter.emit<ApiErrorEventData>(ApiEvent.ResponseError, { label: errorLabel });
        return reject({ label: errorLabel });
      }
      const orgId = apiOrganizationOfPage();
      if (!orgId) return;
      clearInterval(timer);
      return resolve(orgId);
    }, 100);
  });
};

type recursiveListFolderItemsProps = NonNullable<Parameters<typeof api.folders.searchOrgFolderItems>[0]>;
export interface RecursiveFolderItem extends EntityFolderItemInfo {
  next: RecursiveFolderItem[];
}
export const recursiveListFolderItems = async ({
  path,
  partition,
  item_type,
}: recursiveListFolderItemsProps): Promise<RecursiveFolderItem[]> => {
  const { items: rootFolders } = await api.folders.searchOrgFolderItems({ path, item_type, partition });
  if (!rootFolders) return [];
  function resolvePath(base: string, path: string): string {
    if (base.slice(-1)[0] === "/") return `${base}${path}`;
    return `${base}/${path}`;
  }
  async function forEachFolder(folders: EntityFolderItemInfo[]): Promise<RecursiveFolderItem[]> {
    return Promise.all(
      folders.map(async (folder) => {
        const { item_type, dir_path, id } = folder;
        const path = resolvePath(dir_path as string, id as string);
        const { items } = await api.folders.searchOrgFolderItems({ path, item_type, partition });
        if (!items) return { ...folder, next: [] };
        const next = await forEachFolder(items);
        return { ...folder, next };
      })
    );
  }
  return forEachFolder(rootFolders);
};

export const apiAddOrganizationToPageUrl = (id: string) => {
  const url = new URL(window.location.href);
  url.searchParams.append(ORG_ID_KEY, id);
  // sessionStorage.clear();
  window.history.replaceState(null, document.title, url.toString());
};

export const apiLocaleInCookie = () => {
  return Cookies.get(LOCALE_KEY)?.slice(0, 2);
};

export const subscribeLocaleInCookie = (handler: { (locale: string): any }) => {
  let cache = apiLocaleInCookie();
  setInterval(() => {
    const current = apiLocaleInCookie();
    if (cache === current) return;
    cache = current;
    if (current) handler(current);
  }, 1000);
};

export function domainSwitch() {
  return window.location.host.includes("kidsloop.live");
}

export function apiIsEnableReport() {
  return process.env.REACT_APP_ENABLE_REPORT === "1";
}
export function getIsEnableNewGql() {
  return process.env.REACT_APP_USE_LEGACY_GQL === "0";
}
export const enableNewGql = getIsEnableNewGql();

export const enableReviewClass = process.env.REACT_APP_ENABLE_REVIEW_CLASS === "1";

export async function apiSkillsListByIds(skillIds: string[]) {
  const skillsQuery = skillIds
    .map(
      (id, index) => `
    skill${index}: subcategoryNode(id: "${id}") {
      id
      name
      status
    }
    `
    )
    .join("");
  const skillsResult = skillIds.length
    ? await gqlapi.query<{ [key: string]: LinkedMockOptionsItem }, {}>({
        query: gql`
    query skillsListByIds {
      ${skillsQuery}
    } 
    `,
      })
    : { data: {} };
  return skillsResult;
}

export async function apiDevelopmentalListIds(developmental: string[]) {
  const developmentalQuery = developmental
    .map(
      (id, index) => `
    developmental${index}: categoryNode(id: "${id}") {
      id
      name
      status
    }
    `
    )
    .join("");
  const developmentalResult = developmental.length
    ? await gqlapi.query<{ [key: string]: LinkedMockOptionsItem }, {}>({
        query: gql`
    query developmentalListByIds {
      ${developmentalQuery}
    } 
    `,
      })
    : { data: {} };
  return developmentalResult;
}
export interface IApiGetPartPermissionResp {
  error: boolean;
  data: ICacheData;
}

export async function apiGetPartPermission(permissions: string[]): Promise<IApiGetPartPermissionResp> {
  const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";

  if (enableNewGql) {
    const permissionIds = uniq(permissions)
      .map((item) => {
        return `"${item}"`;
      })
      .join(",");
    return await gqlapi
      .query({
        query: gql`
        query{
          myUser{
            hasPermissionsInOrganization(
              organizationId: "${organization_id}",
              permissionIds: [
                ${permissionIds}
              ]
            ){
              permissionId
              allowed
            }
          }
        }
      `,
      })
      .then((resp) => {
        return {
          error: (resp.errors || []).length > 0 || resp.data?.myUser?.hasPermissionsInOrganization === null,
          data: (resp.data?.myUser?.hasPermissionsInOrganization || []).reduce(
            (prev: { [x: string]: any }, cur: { permissionId: string | number; allowed: any }) => {
              prev[cur.permissionId] = cur.allowed;
              return prev;
            },
            {}
          ),
        };
      });
  } else {
    const fragmentStr = permissions
      .map((permission) => {
        return `${permission}: checkAllowed(permission_name: "${permission}")`;
      })
      .join(",");
    return await gqlapi
      .query({
        query: gql`
      query{
        meMembership: me{
          membership(organization_id: "${organization_id}"){
            ${fragmentStr}
          }
        }
      }
    `,
      })
      .then((resp) => {
        return {
          error: (resp.errors || []).length > 0 || resp.data?.meMembership?.membership === null,
          data: resp.data?.meMembership?.membership || {},
        };
      });
  }
}

const idToNameMap = new Map<string, string>();

export async function apiGetUserNameByUserId(userIds: string[]): Promise<Map<string, string>> {
  const fragmentStr = userIds
    .filter((id) => !idToNameMap.has(id))
    .map((userId, index) => {
      return enableNewGql
        ? `
          user_${index}: userNode(id: "${userId}"){
            id,
            givenName 
            familyName
          }
        `
        : `
          user_${index}: user(user_id: "${userId}"){
            user_id,
            given_name
            family_name
          }
        `;
    })
    .join(",");
  if (!fragmentStr) return idToNameMap;
  try {
    const userQuery = await gqlapi.query({
      query: gql`
        query userNameByUserIdQuery{
          ${fragmentStr}
        },
        
      `,
    });
    for (const item in userQuery.data || {}) {
      const user = userQuery.data[item];
      if (user) {
        enableNewGql
          ? idToNameMap.set(user.id, `${user.givenName} ${user.familyName}`)
          : idToNameMap.set(user.user_id, `${user.given_name} ${user.family_name}`);
      }
    }
  } catch (e) {
    console.log(e);
  }
  return idToNameMap;
}

export async function getUserIdAndOrgId() {
  const organizationId = ((await apiWaitForOrganizationOfPage()) as string) || "";

  return organizationId;
}

export const refreshToken = async () => {
  const resp = await fetch(`${process.env.REACT_APP_AUTH_API}/refresh`, { credentials: "include" })
    .then((resp) => resp.json())
    .then((data) => data);
  return resp;
};

export const uploadFile = async (path: string, body: any) => {
  const resp = await fetch(path, { method: "PUT", body }).then((resp) => resp.json);
  return resp;
};

export async function getProgramIdByProgramName(names: string[]) {
  let nameToProgramArray: ProgramsObjProps[] = [];
  if(names.length === 0) return nameToProgramArray;
  const orgId = apiOrganizationOfPage();
  const queryStr = names.map((name, index) => {
    const filter = `{
      AND: [
        {
          OR: [
            {organizationId: {
              operator: eq,
              value: "${orgId}"
            }},
            {system: {operator: eq, value: true}}
          ]
        },
        {name: {
            operator: eq,
            value: "${name}",
            caseInsensitive: false
        }},
        {status: {
          operator: eq, 
          value: "active"
        }}
      ]
    }`;
    return `q_${index}: programsConnection(filter: ${filter}, direction: ${ConnectionDirection.Forward}){
      edges{
        node{
          id,
          name,
          ageRangesConnection {
            edges {
              node {
                id
                name
                status
                system
              }
            }
          },
          gradesConnection {
            edges {
              node {
                id
                name
                status
                system
              }
            }
          }
        }
      }
    }`
  }).join(",");
  try {
  const programResult = await gqlapi.query({
    query: gql`
      query getProgramIdByName{
        ${queryStr}
      }
      `
    });
  for(const item in programResult.data || {}) {
    const program = programResult.data[item];
    if(program && program.edges.length >= 1){
      program.edges.forEach((pItem: { node: { ageRangesConnection: any; gradesConnection: any; id: any; name: any; }; }, index: number) => {
        if(index === 0) {
          const age = pItem.node.ageRangesConnection;
          const grade = pItem.node.gradesConnection;
          nameToProgramArray.push({
            id: pItem.node.id,
            name: pItem.node.name,
            ages: age.edges.map((aItem: { node: { id: any; name: any; system: any; status: any; }; }) => {
              return {
                id: aItem.node.id,
                name: aItem.node.name,
                system: aItem.node.system,
                status: aItem.node.status
              }
            }),
            grades: grade.edges.map((gItem: { node: { id: any; name: any; system: any; status: any; }; }) => {
              return {
                id: gItem.node.id,
                name: gItem.node.name,
                system: gItem.node.system,
                status: gItem.node.status
              }
            })
          })
        }
      })
    }
  }
} catch (e) {
  console.log(e)
}
  return nameToProgramArray;
}

export async function getSubjectIdByProgramIdAndSubjectName(programId: string, subjectNames: string[]): Promise<SubjectObjProps[]>{
  const orgId = apiOrganizationOfPage();
  let nameToSubjectArray: SubjectObjProps[] = [];
  const queryStr = subjectNames
  .map((name, index) => {
    const filterStr = `{
      AND: [
        {
          OR: [
            {
              organizationId: {
                operator: eq,
                value: "${orgId}"
              }
            },
            {
              system: {
                operator: eq, 
                value: true
              }
            }
          ],
          AND: [{
              name: {
                operator: contains, 
                value: "${name}", 
                caseInsensitive: true
              },
              programId: {
                operator: eq,
                value: "${programId}"
              }
          }]
        }
      ],
      status: {operator: eq, value: "active"}
    }`
    return `q_${index}: subjectsConnection(filter: ${filterStr}, direction: ${ConnectionDirection.Forward}){
      edges {
        node {
          id,
          name,
          status,
          system,
          categoriesConnection{
            edges{
              node {
                 id,
         				 name,
                system,
                status,
                subcategoriesConnection{
                  edges{
                    node {
                       id,
                        name,
                      system,
                      status,
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`
  }).join(",");
  try {
    const subjectResult = await gqlapi.query({
      query: gql`
        query getSubjectIdByName{${queryStr}}
      `
    })
    for (const item in subjectResult.data || {}) {
      const subject = subjectResult.data[item];
      if(subject && subject.edges.length >= 1) {
        subject.edges.forEach((sItem: { node: { id: string, name: string, categoriesConnection: any }; }, index: number) => {
          if(index === 0) {
            const category = sItem.node.categoriesConnection
            nameToSubjectArray.push({
              id: sItem.node.id,
              name: sItem.node.name,
              category: category.edges.map((cItem: { node: { id: string; name: string; system: boolean; status: string; subcategoriesConnection: any }; }) => {
                if(cItem) {
                  const subcategory = cItem.node.subcategoriesConnection;
                  return {
                    id: cItem.node.id,
                    name: cItem.node.name,
                    system: cItem.node.system,
                    status: cItem.node.status,
                    subCategory: subcategory.edges.map((scItem: { node: { id: any; name: any; system: any; status: any; }; }) => {
                      return {
                        id: scItem.node.id,
                        name: scItem.node.name,
                        system: scItem.node.system,
                        status: scItem.node.status,
                      }
                    })
                  }
                } else {
                  return undefined
                }
              })
            })
          }
        })
      }
    }
  } catch (e) {
    console.log(e)
  }
  return nameToSubjectArray;
}

export async function getGradeIdByProgramIdAndGradeName(programId: string, gradeNames: string[]) {
}
export function isEnableUpload() {
  return process.env.REACT_APP_ENABLE_UPLOAD_LO === "1"
}






