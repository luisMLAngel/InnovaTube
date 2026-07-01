import { PrismaFilter } from '../interfaces/prisma-filter.interface';
import { RemoveArray } from './prisma-helper.type';

type PrismaCountInclude<T> = {
  _count?: boolean | Pick<PrismaFilter<T>, 'select'>;
};

type PrismaDefaultInclude<T> = {
  [K in keyof T]?: boolean | Pick<PrismaFilter<RemoveArray<T[K]>>, 'select' | 'include' | 'where'>;
};

export type PrismaInclude<T> = PrismaDefaultInclude<T> & PrismaCountInclude<T>;
