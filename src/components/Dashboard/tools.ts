export type RequestQueryParamsType = Record<string | number, any>;

const BaseURL = `${process.env.REACT_APP_BASE_DOMAIN}${process.env.REACT_APP_BASE_API}`;

export function addQueryParams(rawQuery?: RequestQueryParamsType): string {
  const query = rawQuery || {};
  const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
  return keys.length
    ? `?${keys
        .map((key) =>
          typeof query[key] === "object" && !Array.isArray(query[key])
            ? addQueryParams(query[key] as object).substring(1)
            : addQueryParam(query, key)
        )
        .join("&")}`
    : "";
}
export function addQueryParam(query: RequestQueryParamsType, key: string) {
  return encodeURIComponent(key) + "=" + encodeURIComponent(Array.isArray(query[key]) ? query[key].join(",") : query[key]);
}

const safeParseResponse = <T = any>(response: Response): Promise<T> =>
  response
    .json()
    .then((data) => data)
    .catch((e) => response.text);

export async function dFetch(path: string, query: any, method?: "get" | "post") {
  const headers = new Headers();
  headers.append(`Accept`, `application/json`);
  headers.append(`Content-Type`, `application/json`);

  return fetch(`${BaseURL}${path}${addQueryParams(query)}`, {
    method: method ?? "get",
    credentials: `include`,
    headers,
  }).then(async (response) => {
    const data = await safeParseResponse(response);
    if (!response.ok) throw data;
    return data;
  });
}

// formats a date time to a string
export function formatDate(date: Date): string {
  let dateString = "";
  // if date is today return 'Today'
  if (date.toDateString() === new Date().toDateString()) {
    dateString = "Today";
  } else if (date.toDateString() === new Date(Date.now() - 86400000).toDateString()) {
    dateString = "Yesterday";
  } else {
    dateString = date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }
  return `${date.toLocaleTimeString().slice(0, 5)},${dateString}`;
}
