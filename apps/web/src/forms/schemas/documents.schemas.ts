export const documentsSchema = [
  {
    name: 'type',
    label: 'Document Type',
    type: 'select',
    options: [
      { label: 'ID', value: 'ID' },
      { label: 'Certificate', value: 'CERTIFICATE' },
      { label: 'CV', value: 'CV' },
    ],
  },
  {
    name: 'fileUrl',
    label: 'Upload File',
    type: 'file', // 🔥 لازم FormRenderer يدعمها
  },
];
