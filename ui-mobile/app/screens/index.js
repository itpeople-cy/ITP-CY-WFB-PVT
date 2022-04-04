// @flow
export type Screen = {
  screenId: string,
  component: any
}
export type Screens = {
  [keys: string]: Screen
}

let screens: Screens = {
  PERSONA_SELECTION: {
    screenId: 'persona-selection',
    component: () => require('./PersonaSelectionScreen').default
  },
  LOGIN_SCREEN: {
    screenId: 'login',
    component: () => require('./LoginScreen').default
  },
  RETAILER_MENU_SCREEN: {
    screenId: 'retailer-menu',
    component: () => require('./RetailerMenuScreen').default
  },
  CONSUMER_MENU_SCREEN: {
    screenId: 'consumer-menu',
    component: () => require('./ConsumerMenuScreen').default
  },
  FACTORY_MENU_SCREEN: {
    screenId: 'factory-menu',
    component: () => require('./FactoryMenuScreen').default
  },
  SUPPLY_CHAIN_MENU_SCREEN: {
    screenId: 'supply-chain-menu',
    component: () => require('./SupplyChainMenuScreen').default
  },
  SUPPLY_CHAIN_RECORD_SCAN_SCREEN: {
    screenId: 'supply-chain-record-scan',
    component: () => require('./SupplyChainRecordScanScreen').default
  },
  BARCODE_SCANNER_SCREEN: {
    screenId: 'barcode-scan',
    component: () => require('./BarcodeScannerScreen').default
  },
  PRODUCT_DETAILS_SCREEN: {
    screenId: 'product-details',
    component: () => require('./ProductDetailsScreen').default
  },
  TAG_DETAILS_SCREEN: {
    screenId: 'tag-details',
    component: () => require('./TagDetailsScreen').default
  },
  SELL_PRODUCT_SCREEN: {
    screenId: 'sell-product',
    component: () => require('./SellProductScreen').default
  },
  FINISHED_TRANSACTION_SCREEN: {
    screenId: 'finished-transaction',
    component: () => require('./FinishedTransactionScreen').default
  },
  VERIFY_OWNERSHIP_SCREEN: {
    screenId: 'verify-ownership',
    component: () => require('./VerifyOwnershipScreen').default
  }
}
export default screens
