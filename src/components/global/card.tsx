import React from "react";

type Props = {};

const Card = (props: Props) => {
  return (
    <div className="card w-[75%] bg-base-100 shadow-xl">
      <div className="card-body">
        <label className="input input-bordered flex items-center gap-2 text-white">
          Title
          <input type="text" className="grow" placeholder="Daisy" />
        </label>
        <label className="form-control">
          <div className="label">
            <span className="label-text">Note</span>
          </div>
          <textarea
            className="textarea textarea-bordered h-24"
            placeholder="Bio"
          ></textarea>
          <div className="label"></div>
        </label>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  );
};

export default Card;
