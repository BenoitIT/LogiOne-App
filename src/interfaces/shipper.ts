export interface NewShipper {
  id?: number;
  name?: string;
  location?: string;
  email?: string;
  phone?: string;
}
export interface newShipperErrors {
  name?: string | null;
  location?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface NewCustomer {
  id?: number;
  name?: string;
  location?: number;
  email?: string;
  phone?: string;
  tinnumber?: string;
  itemsCode?: string;
}
export interface newCustomerErrors {
  name?: string | null;
  location?: string | null;
  email?: string | null;
  phone?: string | null;
  tinnumber?: string | null;
}
