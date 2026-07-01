import {
  PrismaCursorClause,
  PrismaInclude,
  PrismaOrderByClause,
  PrismaSelectClause,
  PrismaWhereClauseType,
} from '../types';

export type PrismaFilter<T> = {
  skip?: number;
  take?: number;
  orderBy?: PrismaOrderByClause<T>;
  include?: PrismaInclude<T>;
  select?: PrismaSelectClause<T>;
  cursor?: PrismaCursorClause<T>;
  where?: PrismaWhereClauseType<T>;
};

export type PrismaCountFilter<T> = Omit<PrismaFilter<T>, 'orderBy' | 'select' | 'include'>;
