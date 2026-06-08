
const round = (value: number, precision: number) => {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};
export const round2 = (value: number) => round(value, 2);
export const round0 = (value: number) => round(value, 0);
export const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};
export const deepCopy = <AnyType>(obj: AnyType): AnyType =>
  JSON.parse(JSON.stringify(obj)) as AnyType;
export const exhasutiveMatchingGuard = (_: never) => {
  throw new Error("No matching guard");
};
export function logAndThrowError(id: string): never {
  const message = `Error in ${id}`;
  console.log(message);
  throw new Error(message);
}
export function downloadFileHandler(data: any, filename?: string) {
  const blob = new Blob([data], {
    type: "application/octet-stream",
  });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = filename || "file.xls"; // Change the filename if needed
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}
export function downloadFolderHandler(data: any, filename?: string) {
  const blob = new Blob([data], {
    type: "application/zip",
  });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = filename ? `${filename}.zip` : "produktblad.zip";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}
export function enumerate(length: number) {
  return Array.from({ length: length }, (_, i) => i + 1);
}
export function parseNumeric(value: string | number) {
  const stringValue = value.toString();
  let newStringValue = stringValue.replaceAll(",", ".");
  newStringValue = newStringValue.replaceAll(" ", "");
  const parsed = parseFloat(newStringValue);
  if (isNaN(parsed)) return 0;
  return parsed;
}
export function getNumericReadable(value: number | string) {
  const stringValue = value.toString();
  if (isNaN(parseFloat(stringValue))) {
    return stringValue;
  }
  const parts = stringValue.split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1];
  const integerPartLength = integerPart.length;
  const integerArray = integerPart.split("");
  const reversedIntegerArray = integerArray.reverse();
  let newIntegerPart = "";
  for (let i = 0; i < integerPartLength; i++) {
    newIntegerPart += reversedIntegerArray[i];
    if (i % 3 === 2 && i !== 0) {
      newIntegerPart += " ";
    }
  }
  const readableIntegerPart = newIntegerPart.split("").reverse().join("");
  return decimalPart
    ? `${readableIntegerPart}.${decimalPart}`
    : readableIntegerPart;
}
export function haveCommonValue(list1: string[], list2: string[]) {
  for (let i = 0; i < list1.length; i++) {
    if (list2.includes(list1[i])) {
      return true;
    }
  }
  return false;
}
// export function hasPrivilege(
//   user: Auth,
//   allowedGroups: UserGroup[],
//   allowedEmails?: string[],
// ) {
//   if (user.role === "admin") return true;
//   if (allowedEmails && allowedEmails.includes(user.email)) return true;
//   return haveCommonValue(user.groups, allowedGroups);
// }
export function createNumberList(n: number) {
  let list = [];
  for (let i = 1; i <= n; i++) {
    list.push(i);
  }
  return list;
}
