// import { UseFormReturn } from 'react-hook-form';

// export function ReviewStep({ form }: { form: UseFormReturn<any> }) {
//   const values = form.getValues();

//   return (
//     <div className="space-y-4">
//       <h3 className="font-bold">Review Your Application</h3>

//       <pre className="bg-gray-100 p-4 rounded text-sm">
//         {JSON.stringify(values, null, 2)}
//       </pre>
//     </div>
//   );
// }

export function ReviewForm({ formData }: any) {
  return (
    <pre className="bg-gray-100 p-4 rounded">
      {JSON.stringify(formData, null, 2)}
    </pre>
  );
}
