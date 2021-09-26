import React from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

export default function Upload() {
  return (
    <Formik
      initialValues={{ file: null }}
      onSubmit={async (values) => {
        console.alert(
          JSON.stringify(
            {
              fileName: values.file.name,
              type: values.file.type,
              size: `${values.file.size} bytes`,
            },
            null,
            2
          )
        );
      }}
      validationSchema={Yup.object().shape({
        file: Yup.mixed().required(),
      })}
    >
      <Form>
        <div className="form-group">
          <label for="file">File upload</label>
          <Field id="file" name="file" type="file" className="form-control" />
        </div>
        <button type="submit" className="btn">
          Submit
        </button>
      </Form>
    </Formik>
  );
}
