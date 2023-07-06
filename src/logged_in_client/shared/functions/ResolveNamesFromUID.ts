export const resolveUsernameFromUID = (users: any[], uid: string) => {
  const user = users.find((department) => department.asJson.uid === uid);
  return user ? user.asJson.displayName : "";
};

export const resolveDepartmentFromDepartmentID = (
  departments: any[],
  departmentID: string
) => {
  const department = departments.find(
    (department) => department.asJson.id === departmentID
  );

  return department ? department.asJson.name : "";
};
