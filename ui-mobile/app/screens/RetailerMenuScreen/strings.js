export default {
  title: 'Retailer Menu',
  authenticateProductAlerts: {
    barcodeScanned: [
      'Product Scanned',
      'Please scan the corresponding tag data.',
    ],
    qrcodeScanned: [
      'QR Tag Scanned',
      'Please scan the product ID.',
    ]
  },
  tagVerified: [
    'Success!',
    'The tag and product barcode has been verified and is associated to this retailer.'
  ],
  tagUnverified: [
    'Verification error',
    'The tag or product barcode was not verified as being associated to this retailer.'
  ],
  tagError: [
    'An error occurred',
    'You may have scanned the same tag type twice.'
  ]
}
