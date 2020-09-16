import { UseFormMethods } from "react-hook-form";
import { MockOptions, MockOptionsItem, MockOptionsOptionsItem } from "../api/extra";

interface ToFlattenPropsInput {
  programId: string;
  developmentalId: string;
}

export interface FlattenedMockOptions extends Omit<MockOptions, "options">, Omit<MockOptionsOptionsItem, "developmental" | "program"> {
  program: MockOptionsItem[];
  developmental: MockOptionsItem[];
  skills: MockOptionsItem[];
}

export class ModelMockOptions {
  static toFlatten(input: ToFlattenPropsInput, mockOptions: MockOptions): FlattenedMockOptions {
    const { options: originOptions, ...restMockOptions } = mockOptions;
    const program = originOptions.map((item) => item.program);
    const option = originOptions.find((item) => item.program.id === input.programId);
    const emptyOption = ModelMockOptions.getEmptyOptions();
    if (!option) return { ...restMockOptions, ...emptyOption, program };
    const foundDevelopmental = option.developmental.find((item) => item.id === input.developmentalId);
    if (!foundDevelopmental) return { ...restMockOptions, ...option, program, developmental: [], skills: [] };
    const { skills } = foundDevelopmental;
    const developmental = option.developmental.map(({ id, name }) => ({ id, name }));
    return { ...restMockOptions, ...option, skills, developmental, program };
  }

  static getDefaultProgramId(mockOptions: MockOptions): MockOptionsItem["id"] | undefined {
    return mockOptions.options[0]?.program.id;
  }

  static getDefaultDevelopmental(mockOptions: MockOptions, programId?: MockOptionsItem["id"]): MockOptionsItem["id"] | undefined {
    const option = mockOptions.options.find((item) => item.program.id === programId);
    if (!option) return;
    return option.developmental[0]?.id;
  }

  static updateValuesWhenProgramChange(
    setValue: UseFormMethods["setValue"],
    mockOptions: MockOptions,
    programId: MockOptionsItem["id"]
  ): boolean {
    const defaultDevelopmentalId = ModelMockOptions.getDefaultDevelopmental(mockOptions, programId);
    if (!defaultDevelopmentalId || !programId) return false;
    setValue("developmental", [defaultDevelopmentalId]);
    ["subject", "skills", "age", "grade"].forEach((name) => setValue(name, []));
    return true;
  }

  static getEmptyOptions(): Pick<FlattenedMockOptions, "subject" | "developmental" | "skills" | "age" | "grade"> {
    return {
      subject: [],
      developmental: [],
      skills: [],
      age: [],
      grade: [],
    };
  }
}
