import { PrismaOperatorsType } from './prisma-operators.type';
import { Primitives } from './prisma-primitive.type';

export type PrismaWhere<T> = {
  [K in keyof T]?: NonNullable<T[K]> extends Primitives
    ? T[K] | null | PrismaOperatorsType
    : NonNullable<T[K]> extends Array<infer U>
    ? PrismaWhereClauseType<U>
    : PrismaWhereClauseType<T[K]>;
};

// https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries
export type PrismaToManyWhere<T> = {
  some?: PrismaWhereClauseType<T>;
  none?: PrismaWhereClauseType<T>;
  every?: PrismaWhereClauseType<T>;
};

export type PrismaToListWhere = {
  equals?: Primitives[];
  has?: Primitives;
  hasEvery?: Primitives[];
  hasSome?: Primitives[];
  isEmpty?: boolean;
};

// https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries
export type PrismaToOneWhere<T> = {
  is?: PrismaWhereClauseType<T> | null;
  isNot?: PrismaWhereClauseType<T>;
};

export type PrismaWhereAndOrNot<T> = {
  AND?: PrismaWhereClauseType<T>[];
  OR?: PrismaWhereClauseType<T>[];
  NOT?: PrismaWhereClauseType<T>[];
};

export type PrismaWhereClauseType<T> = PrismaWhere<T> &
  PrismaWhereAndOrNot<T> &
  PrismaToOneWhere<T> &
  PrismaToManyWhere<T>;
