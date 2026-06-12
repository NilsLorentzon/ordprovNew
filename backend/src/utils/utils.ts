import { Request, Response } from "express";
import { z } from "zod";
import { User } from "../Models/UserModel";
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const validate =
  (
    schemaBody?: z.ZodSchema<any>,
    schemaParams?: z.ZodSchema<any>,
    schemaQuery?: z.ZodSchema<any>
  ) =>
  (req: Request, res: Response, next: Function) => {
    if (schemaBody) {
      try {
        schemaBody.parse(req.body);
        next();
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).send({
            message: err.message,
            errors: err.errors,
          });
        }
      }
    }
    if (schemaParams) {
      // /{id: string}
      try {
        schemaParams.parse(req.params);
        next();
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).send({
            message: "Invalid query parameters",
            errors: err.errors,
          });
        }
      }
    }
    if (schemaQuery) {
      // ?id=string
      try {
        schemaQuery.parse(req.query);
        next();
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).send({
            message: "Invalid query parameters",
            errors: err.errors,
          });
        }
      }
    }
  };

const round = (value: number, precision: number) => {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};
export const round2 = (value: number) => round(value, 2);
export const round0 = (value: number) => round(value, 0);

export function errorHandler(err, req, res, next) {
  console.log("err", err);
  return res.status(500).json({ message: "Internal Server Error", error: err });
}
export function enumerate(length: number) {
  return Array.from({ length: length }, (_, i) => i + 1);
}
export const exhasutiveMatchingGuard = (_: never) => {
  throw new Error("No matching guard");
};
export const isOneDayOld = (date: Date) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const today = new Date();
  return today.getTime() - date.getTime() < oneDay;
};

export const deepCopy = <AnyType>(obj: AnyType): AnyType =>
  JSON.parse(JSON.stringify(obj)) as AnyType;
export function haveCommonValue(list1: string[], list2: string[]) {
  for (let i = 0; i < list1.length; i++) {
    if (list2.includes(list1[i])) {
      return true;
    }
  }
  return false;
}
// export function userInsideGroups(user: User, allowedGroups: string[]) {
//   return haveCommonValue(user.groups, allowedGroups);
// }
export function deDuplicator(
  data: any[],
  selectorFunction: (datum: any) => any
) {
  const seen = new Set();
  return data.filter((datum) => {
    const selected = selectorFunction(datum);
    if (seen.has(selected)) {
      return false;
    }
    seen.add(selected);
    return true;
  });
}
