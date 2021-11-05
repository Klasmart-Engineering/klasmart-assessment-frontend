import { apiGetPartPermission, getUserIdAndOrgId } from "../api/extra";
import PermissionType from "../api/PermissionType";

export type ICacheData = {
  [key in PermissionType]?: boolean;
};

class PermissionCahce {
  private cacheKey = "";
  private data: ICacheData = {};

  private _add(cacheKey: string, data: ICacheData) {
    this.cacheKey = cacheKey;
    this.data = {
      ...this.data,
      ...data,
    };
  }

  private _get(perms: PermissionType[]) {
    return perms.reduce((prev, cur) => {
      if (this.data.hasOwnProperty(cur)) {
        prev[cur] = !!this.data[cur];
      }
      return prev;
    }, {} as ICacheData);
  }

  private flush() {
    this.data = {};
  }

  usePermission(perms: PermissionType[]): Promise<ICacheData> {
    return new Promise((resolve) => {
      getUserIdAndOrgId().then((orgId) => {
        const keyChanged = this.cacheKey !== "" && orgId !== this.cacheKey;
        keyChanged && this.flush();
        const existPerms = keyChanged ? {} : this._get(perms);
        const noneExistPerms = keyChanged ? perms : perms.filter((perm) => !existPerms.hasOwnProperty(perm));
        if (noneExistPerms.length === 0) {
          resolve(existPerms);
        } else {
          apiGetPartPermission(noneExistPerms)
            .then((data: ICacheData) => {
              const permData = noneExistPerms.reduce((prev, cur) => {
                if (data && data.hasOwnProperty(cur) && "boolean" === typeof data[cur]) {
                  prev[cur] = data[cur];
                }
                return prev;
              }, {} as ICacheData);
              this._add(orgId, permData);
              resolve({
                ...existPerms,
                ...permData,
              });
            })
            .catch(() => {
              //resolve({});
            });
        }
      });
    });
  }
}

export default new PermissionCahce();
