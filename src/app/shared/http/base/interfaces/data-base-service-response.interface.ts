export interface DataBaseServiceResponse<K> {
  code: number;
  entity: K | null;
  message?: string;
  serverResponse: any;
  error?: boolean;
}
