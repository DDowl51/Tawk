// ------------------------- Data from server -------------------------
export interface BaseReturnType {
  status: string;
  message?: string;
}

export interface LoginReturnType extends BaseReturnType {
  token: string;
  userId: string;
}

export interface RegisterReturnType extends BaseReturnType {}
