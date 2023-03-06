export interface Iuser {
  _id: object;
  username: string;
  email: string;
  password?: string;
  addresses: [{ address: string }];
}
