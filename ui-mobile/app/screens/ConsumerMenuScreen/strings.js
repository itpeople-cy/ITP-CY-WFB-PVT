export default {
  title: 'Consumer Menu',
  verifyOwnershipAlerts: {
    barcodeScanned: [
      'Product Scanned',
      'Please scan the corresponding certificate hash.',
    ],
    qrcodeScanned: [
      'Certificate Scanned',
      'Please scan the product ID.',
    ]
  },
  resellAlertMessage: [
    '',
    'Resell will allow the consumer to make a transaction using a "reactivated" product. This feature will be ' +
    'supported in a future version.'
  ]
}
