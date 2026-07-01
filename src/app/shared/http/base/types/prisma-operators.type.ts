import { Primitives } from './prisma-primitive.type';

const QueryMode = {
  default: 'default',
  insensitive: 'insensitive',
};

export type PrismaOperatorsType = {
  equals?: Primitives;
  in?: string[] | number | Date[] | null;
  notIn?: string[] | number | Date[];
  lt?: Primitives;
  lte?: Primitives;
  gt?: Primitives;
  gte?: Primitives;
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  mode?: (typeof QueryMode)[keyof typeof QueryMode];
  not?: Omit<PrismaOperatorsType, 'mode'> | Primitives;
};
