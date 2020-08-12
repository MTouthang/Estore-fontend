import React, { useState } from "react";
import Base from "../core/Base";
import { isAutheticated } from "../auth/helper";
import { Link } from "react-router-dom";
import { createCategory } from "./helper/adminapicall";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, token } = isAutheticated();

  const goBack = () => (
    <div className="mt-5">
      <Link className="btn btn-sm btn-success mb-3 " to="/admin/dashboard">
        Admin Home
      </Link>
    </div>
  );

  const handleChange = (event) => {
    setError("");
    setName(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    //backend request fire
    createCategory(user._id, token, { name }).then((data) => {
      if (data.error) {
        setError(true);
      } else {
        setError("");
        setSuccess(true);
        setName("");
      }
    });
  };

  const successMessage = () => {
    if (success) {
      return <h4 className="text-success">Category created successfully</h4>;
    }
  };

  const warningMessage = () => {
    if (error) {
      return <h4 className="text-success">Failed to create category</h4>;
    }
  };

  const myCategoryform = () => (
    <form>
      <div className="form-group">
        <p className="lead">
          Enter the category
          <input
            type="text"
            className="form-control my-3"
            autoFocus
            required
            placeholder="For Ex. Kitchen items"
            onChange={handleChange}
            value={name}
          />
          <button className="btn btn-outline-info" onClick={onSubmit}>
            {" "}
            Create Category
          </button>
        </p>
      </div>
    </form>
  );

  return (
    <Base
      title="Create a category here"
      description=" Add a new category for a product"
      className="container bg-info p-4"
    >
      <div className="row bg-white rounder">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {warningMessage()}
          {myCategoryform()}
          {goBack()}
        </div>
      </div>
    </Base>
  );
};

export default AddCategory;
