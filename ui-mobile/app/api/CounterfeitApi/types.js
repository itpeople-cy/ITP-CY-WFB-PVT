// @flow
export type Brand = {
  brandID: string,
  name: string,
  logo: string,
  manufacturerIDs: string[],
  tagTechnology: string,
}

export type Location = {
  locationID: string,
  name: string,
  gps: string
}

export type Manufacturer = {
  manufacturerID: string,
  name: string,
  location: Location,
  factoryIDs: string[],
  brandIDs: string[],
}

export type ProductStyle = {
  productProfileID: string,
  name: string,
  size: string,
  weight: string,
  brandID: string,
  description: string,
  imageIDs: any[],
  imageStrings: any[],
}

export type Retailer = {
  retailerID: string,
  name: string,
  location: Location,
}

export type ProductDetails = {
  product: {
    productID: string,
    skuID: string,
    upCode: string,
    profileID: string,
    factoryID: string,
    retailerID: string,
    manufacturerID: string,
    color: string,
    msrp: string,
    manufactureDate: string,
    shippedDate: string,
    publicKey: string,
    privateKey: string,
    brandID: string,
  },
  imageIDs: any[],
  imageStrings: any[],
  ProductStyle: ProductStyle
}

export type Tag = {
  tagID: string,
  brandID: string,
  factoryID: string,
  tagSupplierID: string,
  productID: string,
  status: string,
  pattern: string,
  tagTechnology: string,
  hash: string,
  isVerified: boolean,
}

export type CreateTransaction = {
  email: string,
  productID: string,
  tagID: string,
  location: {
    name: string,
    gps: string
  },
  address: {
    city: string,
    state: string,
    addressline: string
  },
  username: string
}

export type AuthenticateTag = {
  productID: string,
  tagID: string
}

export type CertificateVerification = {
  hash: string,
  email: string,
  productID: string
}

export type AssignTagToProduct = {
  productID: string,
  tagID: string,
  tagTechnology: string,
}

export type RecordScan = {
  location: Location,
  scanBy: string,
  productID: string,
  tagID: string,
  tagSupplierID: string,
}
