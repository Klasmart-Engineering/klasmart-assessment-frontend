export const apiGetMockOptions = () =>
  fetch("https://launch.kidsloop.cn/static/mock-korea-data/select-options.json").then((res) => {
    return res.json();
  });
export interface MockOptionsItem {
  id: string;
  name: string;
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

export const apiResourcePathById = (resource_id?: string) => {
  if (!resource_id) return;
  return `${process.env.REACT_APP_BASE_API}/contents_resources/${resource_id}`;
};

export const apiGetH5pResourceById = (id: string) => {
  return `${process.env.REACT_APP_H5P_API}/h5p/play/${id}`;
};

export const apiCreateH5pResource = () => {
  return `${process.env.REACT_APP_H5P_API}/h5p/new`;
};

export const apiLivePath = (token: string) => {
  const { hostname } = window.location;
  const lastDomainDotName = hostname !== "localhost" ? hostname.split(".").pop() : "cn";
  // 地址修改后需要再改
  const cl = hostname.split(".").pop() === "net" ? "/class-live/" : "";
  return `https://live.kidsloop.${lastDomainDotName}${cl}?token=${token}`;
};

export const apiFetchClassByTeacher = (mockOptions: MockOptions, teacher_id: string) => {
  if (mockOptions.teacher_class_relationship.length) {
    const class_ids = mockOptions.teacher_class_relationship.filter(
      (item: MockOptionsItemTeacherAndClass) => item.teacher_id === teacher_id
    )[0].class_ids;
    class_ids.map((item: string) => {
      return mockOptions.classes.forEach((item1: MockOptionsItem) => {
        if (item1.id === item) return item1;
      });
    });
  }
};
