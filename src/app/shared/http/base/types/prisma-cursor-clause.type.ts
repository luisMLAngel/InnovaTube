/**
 * Extract properties with id
 */
type ExtractIdKeys<T> = {
  [K in keyof T]: K extends `${string}Id` ? K : never;
}[keyof T];

/**
 * Combine properties with id for the cursor
 */
type CombineIdKeys<T> = {
  [K in ExtractIdKeys<T> as K extends ExtractIdKeys<T> // userId ownerId
    ? `${K & string}_${Exclude<ExtractIdKeys<T>, K> & string}` // userId_ownerId
    : never]?: {
    [P in K | Exclude<ExtractIdKeys<T>, K>]: string;
  };
};

/**
 * For the cursor, only properties with id are used
 */
export type PrismaCursorClause<T> = {
  [K in keyof T as K extends `${string}Id` | 'id' ? K : never]?: string;
} & CombineIdKeys<T>;
