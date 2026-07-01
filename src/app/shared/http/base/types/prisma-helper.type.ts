/**
 * IState[] | State => IState
 */
export type RemoveArray<Type> = Type extends Array<infer U> ? U : Type;

