/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
 * Asset
 */
export interface AssetCreateRequest {
  /** asset name */
  name?: string;
  size?: number;
  category?: Category;
  tags?: Tag[];
  url?: string;
}

export type CreateContentRequest = {
  content_type?: number;
  name?: string;
  program?: string;
  subject?: string;
  developmental?: string;
  skills?: string;
  age?: string;
  keywords?: string[];
  description?: string;
  thumbnail?: string;
  do_publish?: boolean;
  data?: object;
  extra?: string;
  publish_scope?: string;
};

export type PublishContentRequest = { scope?: string };

export type RejectReasonRequest = { reject_reason?: string };

export type LockContentResponse = { content_id?: string };

export type ContentCondition = {
  content_type?: string[];
  scope?: string[];
  publish_status?: string[];
  author?: string;
  org?: string;
  bookmark?: string;
};

export type Content = {
  id?: string;
  content_type?: number;
  name?: string;
  program?: string;
  subject?: string;
  developmental?: string;
  skills?: string;
  age?: string;
  keywords?: string[];
  description?: string;
  thumbnail?: string;
  version?: number;
  source_id?: string;
  locked_by?: string;
  data?: object;
  extra?: string;
  author?: string;
  author_name?: string;
  org?: string;
  publish_scope?: string;
  publish_status?: string;
  content_type_name?: string;
  program_name?: string;
  subject_name?: string;
  developmental_name?: string;
  skills_name?: string;
  age_name?: string;
  org_name?: string;
};

export type Asset = AssetCreateRequest & { id?: string; uploader?: string; created_at?: number; updated_at?: number };

/**
 * create tag request
 */
export interface TagCreate {
  /** tag name */
  name?: string;
}

/**
 * update tag request
 */
export interface TagUpdate {
  /** tag name */
  name?: string;

  /**
   *
   *  * 1 - enable
   *  * 2 - disable
   *
   */
  states?: 1 | 2;
}

/**
 * Asset
 */
export interface Tag {
  /** tag id */
  id?: string;

  /** tag name */
  name?: string;

  /**
   *
   *  * 1 - enable
   *  * 2 - disable
   *
   */
  states?: 1 | 2;

  /** tag create time, timestamp */
  created_at?: number;
}

/**
 * Asset
 */
export interface CategoryCreateRequest {
  /** category name */
  name?: string;

  /** parent category id */
  parent_id?: string;
}

/**
 * Category
 */
export interface Category {
  /** CategoryID */
  id?: string;

  /** asset name */
  name?: string;

  /** ParentCategoryID */
  parent_id?: string;
}

/**
 * schedule short info
 */
export interface Schedule {
  /** schedule id */
  id?: string;

  /** schedule title */
  title?: string;

  /** schedule start time, timestamp */
  start_at?: number;

  /** schedule end time, timestamp */
  end_at?: number;
  lesson_plan?: CommonShort;
  teachers?: CommonShort[];
}

/**
 * schedule create info
 */
export interface ScheduleCreate {
  /** schedule title */
  title?: string;

  /** schedule class id */
  class_id?: string;

  /** schedule lesson_plan_id */
  lesson_plan_id?: string;

  /** schedule teacher_ids */
  teacher_ids?: string[];

  /** schedule start time, timestamp */
  start_at?: number;

  /** schedule end time, timestamp */
  end_at?: number;

  /**
   *
   *  * AllDay - this class will last for 24 hours for the whole day
   *  * Repeat - repeat it daily/weekly/monthly/yearly
   *
   */
  mode_type?: "AllDay" | "Repeat";

  /** repeat options, only work when mode_type equal Repeat, */
  repeat?: {
    type?: "never" | "after_count" | "after_time";
    daily?: { interval?: number; end?: RepeatEnd };
    weekly?: { interval?: number; on?: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat"; end?: RepeatEnd };
    monthly?: {
      interval?: number;
      on_type?: "date" | "week";
      on_date_day?: number;
      on_week_seq?: "first" | "second" | "third" | "fourth" | "last";
      on_week?: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
      end?: RepeatEnd;
    };
    yearly?: {
      interval?: number;
      on_type?: "date" | "week";
      on_date_month?: number;
      on_date_day?: number;
      on_week_month?: number;
      on_week_seq?: "first" | "second" | "third" | "fourth" | "last";
      on_week?: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
      end?: RepeatEnd;
    };
  };

  /** schedule SubjectID */
  subject_id?: string;

  /** schedule ProgramID */
  program_id?: string;

  /** schedule class_type */
  class_type?: "OnlineClass" | "OfflineClass" | "Homework" | "Task";

  /** If I schedule the time as homework or task, then I should be able to set a due date. This is optional for me. The due date cannot be earlier than class end time. */
  due_at?: number;

  /** schedule description */
  description?: string;

  /** schedule attachment id */
  attachment_id?: string;

  /** If true, skip the conflict detection */
  is_force?: boolean;
}

/**
 * schedule create info
 */
export interface ScheduleUpdate {
  /** schedule title */
  title?: string;

  /** schedule lessonPlan name */
  class_id?: string;

  /** schedule title */
  lesson_plan_id?: string;

  /** schedule lessonPlan name */
  teacher_ids?: string[];

  /** schedule start time, timestamp */
  start_at?: number;

  /** schedule end time, timestamp */
  end_at?: number;

  /**
   *
   *  * AllDay - this class will last for 24 hours for the whole day
   *  * Repeat - repeat it daily/weekly/monthly/yearly
   *
   */
  mode_type?: "AllDay" | "Repeat";

  /** repeat edit option */
  repeat_edit_options?: "only_current" | "with_following";

  /** repeat options, only work when mode_type equal Repeat, */
  repeat?: {
    type?: "never" | "after_count" | "after_time";
    daily?: { interval?: number; end?: RepeatEnd };
    weekly?: { interval?: number; on?: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat"; end?: RepeatEnd };
    monthly?: {
      interval?: number;
      on_type?: "date" | "week";
      on_date_day?: number;
      on_week_seq?: "first" | "second" | "third" | "fourth" | "last";
      on_week?: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
      end?: RepeatEnd;
    };
    yearly?: {
      interval?: number;
      on_type?: "date" | "week";
      on_date_month?: number;
      on_date_day?: number;
      on_week_month?: number;
      on_week_seq?: "first" | "second" | "third" | "fourth" | "last";
      on_week?: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
      end?: RepeatEnd;
    };
  };

  /** schedule SubjectID */
  subject_id?: string;

  /** schedule ProgramID */
  program_id?: string;

  /** schedule class_type */
  class_type?: "OnlineClass" | "OfflineClass" | "Homework" | "Task";

  /** If I schedule the time as homework or task, then I should be able to set a due date. This is optional for me. The due date cannot be earlier than class end time. */
  due_at?: number;

  /** schedule description */
  description?: string;

  /** schedule attachment id */
  attachment_id?: string;

  /** If true, skip the conflict detection */
  is_force?: boolean;
}

/**
 * schedule create info
 */
export interface ScheduleDetailed {
  /** schedule id */
  id?: string;

  /** schedule title */
  title?: string;
  class?: CommonShort;
  lesson_plan?: CommonShort;
  teachers?: CommonShort[];

  /** schedule start time, timestamp */
  start_at?: number;

  /** schedule end time, timestamp */
  end_at?: number;

  /**
   *
   *  * AllDay - this class will last for 24 hours for the whole day
   *  * Repeat - repeat it daily/weekly/monthly/yearly
   *
   */
  mode_type?: "AllDay" | "Repeat";

  /** repeat options, only work when mode_type equal Repeat, */
  repeat?: {
    type?: "never" | "after_count" | "after_time";
    daily?: { interval?: number; end?: RepeatEnd };
    weekly?: { interval?: number; on?: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat"; end?: RepeatEnd };
    monthly?: {
      interval?: number;
      on_type?: "date" | "week";
      on_date_day?: number;
      on_week_seq?: "first" | "second" | "third" | "fourth" | "last";
      on_week?: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
      end?: RepeatEnd;
    };
    yearly?: {
      interval?: number;
      on_type?: "date" | "week";
      on_date_month?: number;
      on_date_day?: number;
      on_week_month?: number;
      on_week_seq?: "first" | "second" | "third" | "fourth" | "last";
      on_week?: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
      end?: RepeatEnd;
    };
  };
  subject?: CommonShort;
  program?: CommonShort;

  /** schedule class_type */
  class_type?: "OnlineClass" | "OfflineClass" | "Homework" | "Task";

  /** If I schedule the time as homework or task, then I should be able to set a due date. This is optional for me. The due date cannot be earlier than class end time. */
  due_at?: number;

  /** schedule description */
  description?: string;
  attachment?: CommonShort;
}

/**
 * short info
 */
export interface CommonShort {
  /** id */
  id?: string;

  /** name */
  name?: string;
}

/**
 * repeat end options
 */
export interface RepeatEnd {
  type?: "never" | "after_count" | "after_time";

  /** end after N count */
  after_count?: number;

  /** end after the time(unix timestamp) */
  after_time?: number;
}

export type RequestParams = Omit<RequestInit, "body" | "method"> & {
  secure?: boolean;
};

export type RequestQueryParamsType = Record<string | number, any>;

type ApiConfig<SecurityDataType> = {
  baseUrl?: string;
  baseApiParams?: RequestParams;
  securityWorker?: (securityData: SecurityDataType) => RequestParams;
};

enum BodyType {
  Json,
}

class HttpClient<SecurityDataType> {
  public baseUrl: string = "http://127.0.0.1:12345/1.0";
  private securityData: SecurityDataType = null as any;
  private securityWorker: ApiConfig<SecurityDataType>["securityWorker"] = (() => {}) as any;

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor({ baseUrl, baseApiParams, securityWorker }: ApiConfig<SecurityDataType> = {}) {
    this.baseUrl = baseUrl || this.baseUrl;
    this.baseApiParams = baseApiParams || this.baseApiParams;
    this.securityWorker = securityWorker || this.securityWorker;
  }

  public setSecurityData = (data: SecurityDataType) => {
    this.securityData = data;
  };

  private addQueryParam(query: RequestQueryParamsType, key: string) {
    return encodeURIComponent(key) + "=" + encodeURIComponent(Array.isArray(query[key]) ? query[key].join(",") : query[key]);
  }

  protected addQueryParams(rawQuery?: RequestQueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys.length
      ? `?${keys
          .map((key) =>
            typeof query[key] === "object" && !Array.isArray(query[key])
              ? this.addQueryParams(query[key] as object).substring(1)
              : this.addQueryParam(query, key)
          )
          .join("&")}`
      : "";
  }

  private bodyFormatters: Record<BodyType, (input: any) => any> = {
    [BodyType.Json]: JSON.stringify,
  };

  private mergeRequestOptions(params: RequestParams, securityParams?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params,
      ...(securityParams || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params.headers || {}),
        ...((securityParams && securityParams.headers) || {}),
      },
    };
  }

  private safeParseResponse = <T = any, E = any>(response: Response): Promise<T> =>
    response
      .json()
      .then((data) => data)
      .catch((e) => response.text);

  public request = <T = any, E = any>(
    path: string,
    method: string,
    { secure, ...params }: RequestParams = {},
    body?: any,
    bodyType?: BodyType,
    secureByDefault?: boolean
  ): Promise<T> =>
    fetch(`${this.baseUrl}${path}`, {
      // @ts-ignore
      ...this.mergeRequestOptions(params, (secureByDefault || secure) && this.securityWorker(this.securityData)),
      method,
      body: body ? this.bodyFormatters[bodyType || BodyType.Json](body) : null,
    }).then(async (response) => {
      const data = await this.safeParseResponse<T, E>(response);
      if (!response.ok) throw data;
      return data;
    });
}

/**
 * @title KidsLoop 2.0 Asset REST API
 * @version 1.0.0
 * @baseUrl http://127.0.0.1:12345/1.0
 * Kidsloop 2.0 Asset backend rest api
 */
export class Api<SecurityDataType = any> extends HttpClient<SecurityDataType> {
  contents = {
    /**
     * @tags content
     * @name contentsList
     * @request GET:/contents
     * @description Search content with condition
     */
    contentsList: (
      query?: {
        name?: string | null;
        content_type?: string | null;
        publish_status?: string | null;
        scope?: string | null;
        author?: string | null;
        org?: string | null;
        key?: string | null;
      },
      params?: RequestParams
    ) => this.request<{ key?: string; list?: Content[] }, any>(`/contents${this.addQueryParams(query)}`, "GET", params),

    /**
     * @tags content
     * @name contentsCreate
     * @request POST:/contents
     * @description Create content
     */
    contentsCreate: (data: CreateContentRequest, params?: RequestParams) =>
      this.request<{ total?: string }, any>(`/contents`, "POST", params, data),

    /**
     * @tags content
     * @name publishUpdate
     * @request PUT:/contents/{content_id}/publish
     * @description Publish content
     */
    publishUpdate: (content_id: string, data: PublishContentRequest, params?: RequestParams) =>
      this.request<any, any>(`/contents/${content_id}/publish`, "PUT", params, data),

    /**
     * @tags content
     * @name lockUpdate
     * @request PUT:/contents/{content_id}/lock
     * @description Lock a content by content_id
     */
    lockUpdate: (content_id: string, params?: RequestParams) =>
      this.request<LockContentResponse, any>(`/contents/${content_id}/lock`, "PUT", params),

    /**
     * @tags content
     * @name contentsDetail
     * @request GET:/contents/{content_id}
     * @description Get content by content_id
     */
    contentsDetail: (content_id: string, params?: RequestParams) => this.request<Content, any>(`/contents/${content_id}`, "GET", params),

    /**
     * @tags content
     * @name contentsUpdate
     * @request PUT:/contents/{content_id}
     * @description Update content by content_id
     */
    contentsUpdate: (content_id: string, data: CreateContentRequest, params?: RequestParams) =>
      this.request<any, any>(`/contents/${content_id}`, "PUT", params, data),

    /**
     * @tags content
     * @name contentsDelete
     * @request DELETE:/contents/{content_id}
     * @description Delete content by content_id
     */
    contentsDelete: (content_id: string, params?: RequestParams) => this.request<any, any>(`/contents/${content_id}`, "DELETE", params),
  };
  contentsReview = {
    /**
     * @tags content
     * @name approveUpdate
     * @request PUT:/contents_review/{content_id}/approve
     * @description Approve a content review by content_id
     */
    approveUpdate: (content_id: string, params?: RequestParams) =>
      this.request<any, any>(`/contents_review/${content_id}/approve`, "PUT", params),

    /**
     * @tags content
     * @name rejectUpdate
     * @request PUT:/contents_review/{content_id}/reject
     * @description Reject a content review by content_id
     */
    rejectUpdate: (content_id: string, data: RejectReasonRequest, params?: RequestParams) =>
      this.request<any, any>(`/contents_review/${content_id}/reject`, "PUT", params, data),
  };
  contentsPrivate = {
    /**
     * @tags content
     * @name contentsPrivateList
     * @request GET:/contents_private
     * @description Search user's private content with condition
     */
    contentsPrivateList: (
      query?: {
        name?: string | null;
        content_type?: string | null;
        publish_status?: string | null;
        scope?: string | null;
        author?: string | null;
        org?: string | null;
        key?: string | null;
      },
      params?: RequestParams
    ) => this.request<{ key?: string; list?: Content[] }, any>(`/contents_private${this.addQueryParams(query)}`, "GET", params),
  };
  contentsPending = {
    /**
     * @tags content
     * @name contentsPendingList
     * @request GET:/contents_pending
     * @description Search pending content
     */
    contentsPendingList: (
      query?: {
        name?: string | null;
        content_type?: string | null;
        publish_status?: string | null;
        scope?: string | null;
        author?: string | null;
        org?: string | null;
        key?: string | null;
      },
      params?: RequestParams
    ) => this.request<{ key?: string; list?: Content[] }, any>(`/contents_pending${this.addQueryParams(query)}`, "GET", params),
  };
  assets = {
    /**
     * @tags asset
     * @name queryAsset
     * @summary query asset
     * @request GET:/assets
     * @secure
     * @description query asset
     */
    queryAsset: (
      query?: {
        id?: string | null;
        name?: string | null;
        category?: string | null;
        size_min?: number | null;
        size_max?: number | null;
        tag?: string | null;
        page?: number | null;
        page_size?: number | null;
        order_by?: "name" | "-name" | "create_at" | "-create_at" | "last_update_at" | "-last_update_at";
      },
      params?: RequestParams
    ) =>
      this.request<{ total?: number; list?: Asset[] }, any>(
        `/assets${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true
      ),

    /**
     * @tags asset
     * @name createAsset
     * @summary CreateAsset
     * @request POST:/assets
     * @secure
     * @description CreateAsset
     */
    createAsset: (data: AssetCreateRequest, params?: RequestParams) =>
      this.request<Asset, any>(`/assets`, "POST", params, data, BodyType.Json, true),

    /**
     * @tags asset
     * @name getAsset
     * @summary GetAsset
     * @request GET:/assets/{asset_id}
     * @secure
     * @description GetAsset
     */
    getAsset: (asset_id: string, params?: RequestParams) =>
      this.request<Asset, any>(`/assets/${asset_id}`, "GET", params, null, BodyType.Json, true),

    /**
     * @tags asset
     * @name updateAsset
     * @summary update asset
     * @request PUT:/assets/{asset_id}
     * @secure
     * @description update asset
     */
    updateAsset: (asset_id: string, data: AssetCreateRequest, params?: RequestParams) =>
      this.request<Asset, any>(`/assets/${asset_id}`, "PUT", params, data, BodyType.Json, true),

    /**
     * @tags asset
     * @name deleteAsset
     * @summary delete asset
     * @request DELETE:/assets/{asset_id}
     * @secure
     * @description delete asset
     */
    deleteAsset: (asset_id: string, params?: RequestParams) =>
      this.request<any, any>(`/assets/${asset_id}`, "DELETE", params, null, BodyType.Json, true),

    /**
     * @tags asset
     * @name getAssetUploadPath
     * @summary GetAssetUploadPath
     * @request GET:/assets/{ext}/upload
     * @secure
     * @description GetAssetUploadPath
     */
    getAssetUploadPath: (ext: string, params?: RequestParams) =>
      this.request<{ path?: string }, any>(`/assets/${ext}/upload`, "GET", params, null, BodyType.Json, true),
  };
  categories = {
    /**
     * @tags category
     * @name queryCategory
     * @summary query category
     * @request GET:/categories
     * @secure
     * @description query category
     */
    queryCategory: (
      query?: {
        ids?: string | null;
        names?: string | null;
        page?: number | null;
        page_size?: number | null;
        order_by?: "name" | "-name" | "create_at" | "-create_at" | "last_update_at" | "last_update_at";
      },
      params?: RequestParams
    ) =>
      this.request<{ total?: number; list?: Category[] }, any>(
        `/categories${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true
      ),

    /**
     * @tags category
     * @name createCategory
     * @summary create category
     * @request POST:/categories
     * @secure
     * @description create category
     */
    createCategory: (data: CategoryCreateRequest, params?: RequestParams) =>
      this.request<Category, any>(`/categories`, "POST", params, data, BodyType.Json, true),

    /**
     * @tags category
     * @name getCategory
     * @summary get category
     * @request GET:/categories/{category_id}
     * @secure
     * @description get category
     */
    getCategory: (category_id: string, params?: RequestParams) =>
      this.request<Category, any>(`/categories/${category_id}`, "GET", params, null, BodyType.Json, true),

    /**
     * @tags category
     * @name updateCategory
     * @summary update category
     * @request PUT:/categories/{category_id}
     * @secure
     * @description update category
     */
    updateCategory: (category_id: string, data: CategoryCreateRequest, params?: RequestParams) =>
      this.request<Category, any>(`/categories/${category_id}`, "PUT", params, data, BodyType.Json, true),

    /**
     * @tags category
     * @name deleteCategory
     * @summary delete category
     * @request DELETE:/categories/{category_id}
     * @secure
     * @description delete category
     */
    deleteCategory: (category_id: string, params?: RequestParams) =>
      this.request<any, any>(`/categories/${category_id}`, "DELETE", params, null, BodyType.Json, true),
  };
  tag = {
    /**
     * @tags tag
     * @name queryTag
     * @summary query tag
     * @request GET:/tag
     * @secure
     * @description query tag
     */
    queryTag: (
      query?: {
        name?: string | null;
        page?: number | null;
        page_size?: number | null;
        order_by?: "name" | "-name" | "create_at" | "-create_at";
      },
      params?: RequestParams
    ) => this.request<{ total?: number; list?: Tag[] }, any>(`/tag${this.addQueryParams(query)}`, "GET", params, null, BodyType.Json, true),

    /**
     * @tags tag
     * @name createTag
     * @summary create tag
     * @request POST:/tag
     * @secure
     * @description Create Tag
     */
    createTag: (data: TagCreate, params?: RequestParams) => this.request<string, any>(`/tag`, "POST", params, data, BodyType.Json, true),

    /**
     * @tags tag
     * @name GetTagByID
     * @summary get tag by id
     * @request GET:/tag/{tag_id}
     * @secure
     * @description get tag by id
     */
    getTagById: (tag_id: string, params?: RequestParams) =>
      this.request<Tag, any>(`/tag/${tag_id}`, "GET", params, null, BodyType.Json, true),

    /**
     * @tags tag
     * @name updateTag
     * @summary update tag
     * @request PUT:/tag/{tag_id}
     * @secure
     * @description update tag
     */
    updateTag: (tag_id: string, data: TagUpdate, params?: RequestParams) =>
      this.request<Tag, any>(`/tag/${tag_id}`, "PUT", params, data, BodyType.Json, true),

    /**
     * @tags tag
     * @name deleteTag
     * @summary delete tag
     * @request DELETE:/tag/{tag_id}
     * @secure
     * @description delete tag
     */
    deleteTag: (tag_id: string, params?: RequestParams) =>
      this.request<any, any>(`/tag/${tag_id}`, "DELETE", params, null, BodyType.Json, true),
  };
  schedules = {
    /**
     * @tags schedule
     * @name queryschedules
     * @summary query schedules
     * @request GET:/schedules
     * @secure
     * @description query schedules
     */
    queryschedules: (query?: { teacher_id?: string | null; last_key?: string | null; page_size?: number | null }, params?: RequestParams) =>
      this.request<{ total?: number; data?: Schedule[] }, any>(
        `/schedules${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true
      ),

    /**
     * @tags schedule
     * @name createSchedule
     * @summary create schedule
     * @request POST:/schedules
     * @secure
     * @description Create schedule
     */
    createSchedule: (data: ScheduleCreate, params?: RequestParams) =>
      this.request<string, any>(`/schedules`, "POST", params, data, BodyType.Json, true),

    /**
     * @tags schedule
     * @name GetSchedulesByID
     * @summary get schedules by id
     * @request GET:/schedules/{schedule_id}
     * @secure
     * @description get schedules by id
     */
    getSchedulesById: (schedule_id: string, params?: RequestParams) =>
      this.request<ScheduleDetailed, any>(`/schedules/${schedule_id}`, "GET", params, null, BodyType.Json, true),

    /**
     * @tags schedule
     * @name updateSchedule
     * @summary update schedule
     * @request PUT:/schedules/{schedule_id}
     * @secure
     * @description update schedule
     */
    updateSchedule: (schedule_id: string, data: ScheduleUpdate, params?: RequestParams) =>
      this.request<string, any>(`/schedules/${schedule_id}`, "PUT", params, data, BodyType.Json, true),

    /**
     * @tags schedule
     * @name deleteSchedule
     * @summary delete schedule
     * @request DELETE:/schedules/{schedule_id}
     * @secure
     * @description delete schedule
     */
    deleteSchedule: (schedule_id: string, query?: { repeat_edit_options?: "only_current" | "with_following" }, params?: RequestParams) =>
      this.request<any, any>(`/schedules/${schedule_id}${this.addQueryParams(query)}`, "DELETE", params, null, BodyType.Json, true),
  };
}