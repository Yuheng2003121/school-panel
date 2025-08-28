// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import React, { useActionState, useEffect, useRef } from "react";
// import { useForm } from "react-hook-form";
// import InputField from "../InputField";
// import { subjectsSchema } from "@/lib/formValidationSchema";
// import { createSubject } from "@/lib/actions";
// import { toast } from "sonner";

// interface FormProps {
//   type: "update" | "create";
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   data?: any;
// }

// export default function SubjectForm({ type, data }: FormProps) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ resolver: zodResolver(subjectsSchema) });
//   const formRef = useRef<HTMLFormElement>(null)

//   const [state, formAction] = useActionState(createSubject, {
//     success: false,
//     error: ''
//   })

//   useEffect(() => {
//     if (state.error && !state.success) {
//       toast.error(state.error);
//     } else if (state.success) {
//       toast.success("Subject created successfully");
//       formRef.current?.reset();
//     }
//   }, [state]);

//   const onSubmit = (data) => {
//     // await createSubject(data);
//     formAction(data)
//     formRef.current?.reset()

//     if(state.error && !state.success) {
//       toast.error(state.error)
//     } else if (state.success) {
//       toast.success('Subject created successfully')
//     }
//   };

//   return (
//     <form
//       className="flex flex-col gap-8"
//       onSubmit={handleSubmit(onSubmit)}
//       ref={formRef}
//     >
//       <h1 className="text-xl font-semibold">
//         {type === "create" ? "Create a new subject" : "Update this subject"}{" "}
//       </h1>

//       <div className="flex flex-wrap justify-between gap-4">
// <InputField
//   label="Subject name"
//   name="name"
//   defaultValue={data?.name}
//   register={register}
//   error={errors?.name}
// />
//       </div>

// <button
//   type="submit"
//   className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-400/80"
// >
//   {type === "create" ? "Create" : "Update"}
// </button>
//     </form>
//   );
// }

"use client";

import React, { useActionState, useEffect } from "react";
// import { toast } from "sonner";
import { createSubject, updateSubject } from "@/lib/actions/subject";
import { toast } from "react-toastify";

interface FormProps {
  type: "update" | "create";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  setOpen: (isOpen: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relatedData?: any;
}

export default function SubjectForm({
  type,
  data,
  setOpen,
  relatedData,
}: FormProps) {
  //添加/更新
  const [state, action, pending] = useActionState(
    type === "create" ? createSubject : updateSubject.bind(null, data?.id),
    {
      success: false,
      error: "",
    }
  );
  useEffect(() => {
    if (state.error && !state.success) {
      toast.error(state.error);
    } else if (state.success) {
      toast.success("Subject created successfully");
      setOpen(false);
    }
  }, [state, setOpen]);

 

  return (
    <form
      className="flex flex-col gap-8"
      // action={type === "create" ? create : update}
      action={action}
    >
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new subject" : "Update this subject"}
      </h1>

      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="name" className="text-sm font-medium text-gray-500">
            Subject name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={data?.name}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {state.error && (
            <p className="text-red-500 text-sm">{state.error}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 ">
        <label className="text-xs text-gray-500">Teachers</label>
        <select
          multiple
          name="teachers"
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          defaultValue={data?.teachers}
        >
          {relatedData?.teachers.map(
            (teacher: { id: string; name: string; surname: string }) => (
              <option key={teacher.id} value={teacher.id} className="p-2">
                {teacher.name + " " + teacher.surname}
              </option>
            )
          )}
        </select>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-400/80"
      >
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
}
