import React from "react";
import { Formik, Field, Form } from "formik";

export default function Bookmark() {
  return (
    <Formik
      initialValues={{ url: "" }}
      onSubmit={async (values) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        alert(JSON.stringify(values, null, 2));
      }}
    >
      <Form>
        <Field name="url" type="url" />
        <button type="submit" className="btn">
          Submit
        </button>
      </Form>
    </Formik>
  );
}
