import { mockCourses } from "../../requests/mocks/mockData";

export const courseService = {
  listCourses() {
    return mockCourses;
  },
};
