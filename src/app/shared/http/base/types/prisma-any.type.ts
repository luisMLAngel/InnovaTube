import { PrismaOperatorsType } from './prisma-operators.type';
import { Primitives } from './prisma-primitive.type';

export type PrismaAnyType = {
  [key: string]: PrismaOperatorsType | Primitives;
};
