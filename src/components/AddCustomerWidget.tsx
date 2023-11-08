import React, { useRef, useState } from "react";
import dialcodes from "../assets/dialcodes.json";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { closePanel, updateWasRecordAdded } from "../app/customer.slice";

export default function AddCustomerWidget() {
  const dispatch = useDispatch();

  const form = useRef<HTMLFormElement>(null);
  const zipCodeError = useRef<HTMLParagraphElement>(null);
  // @ts-ignore
  const apiBaseURL = import.meta.env.VITE_API_BASEURL;

  const handleZipCodeChange = (e: any) => {
    const inputValue = e.target.value;
    const element = zipCodeError.current as HTMLParagraphElement;

    // Is numberic
    if (
      /\d/gm.test(inputValue) &&
      (/-/gm.test(inputValue) || !/\D/.test(inputValue))
    ) {
      if (/-/gm.test(inputValue)) {
        inputValue.length != 10
          ? (element.innerHTML =
              "<div class='pt-1'>The ZIP code must be in the format 00000-0000.</div>")
          : (element.innerHTML = "");

        return;
      }

      inputValue.length != 5
        ? (element.innerHTML =
            "<div class='pt-1'>The ZIP code must be in the format 00000.</div>")
        : (element.innerHTML = "");

      return;
    }

    // Input is alphanumeric
    if (/\w/gm.test(inputValue)) {
      inputValue.length != 10
        ? (element.innerHTML =
            "<div class='pt-1'>The ZIP code must be alphanumeric and consist of exactly 10 characters.</div>")
        : (element.innerHTML = "");

      return;
    }

    element.innerHTML = "";
  };

  const createCustomer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("companyName", form.current?.companyName.value);
    formData.append(
      "companyEmployeeCount",
      form.current?.companyEmployeeCount.value
    );
    formData.append(
      "companyStreetAddress",
      form.current?.companyStreetAddress.value
    );
    formData.append("companyCity", form.current?.companyCity.value);
    formData.append("companyStateCode", form.current?.companyStateCode.value);
    formData.append("companyZipCode", form.current?.companyZipCode.value);
    formData.append(
      "companyAddressPrimary",
      form.current?.companyAddressPrimary.value
    );
    formData.append("companyAddressHQ", form.current?.companyAddressHQ.value);
    formData.append("contactName", form.current?.contactName.value);
    formData.append("contactEmail", form.current?.contactEmail.value);
    formData.append(
      "contactPhonePrefix",
      form.current?.contactPhonePrefix.value
    );
    formData.append("contactPhone", form.current?.contactPhone.value);

    axios({
      method: "POST",
      data: formData,
      url: `${apiBaseURL}/api/customers/create`,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        dispatch(updateWasRecordAdded(Math.random() * 10e6));
        dispatch(closePanel());
      })
      .catch(function (response) {
        //handle error
        dispatch(closePanel());
      });
  };

  return (
    <div className="bg-blue-50 p-4 rounded-sm">
      <h2>Add new Customer Details</h2>

      <form
        ref={form}
        method="POST"
        onSubmit={createCustomer}
        className="mt-6 flex flex-col gap-3"
      >
        <div className="grid gap-1">
          <label className="text-[#888]" htmlFor="companyName">
            Add company info
          </label>
          <div className="w-full grid grid-cols-2 gap-2">
            <input
              required
              className="p-2 rounded-sm border"
              type="text"
              tabIndex={1}
              name="companyName"
              placeholder="Name"
            />
            <input
              required
              className="p-2 rounded-sm border"
              type="number"
              tabIndex={2}
              name="companyEmployeeCount"
              placeholder="No of Employees"
            />
          </div>
        </div>

        <div className="grid gap-1">
          <label className="text-[#888]" htmlFor="companyName">
            Contact Information
          </label>
          <div className="grid gap-2">
            <input
              required
              className="p-2 rounded-sm border"
              type="text"
              tabIndex={3}
              name="contactName"
              placeholder="Contact Name"
            />
            <input
              required
              className="p-2 rounded-sm border"
              type="text"
              tabIndex={3}
              name="contactEmail"
              placeholder="Contact Email"
            />
            <div className="w-full grid grid-cols-[auto_1fr] gap-2">
              <div className="pr-2 bg-white w-full border rounded-sm">
                <select
                  tabIndex={5}
                  name="contactPhonePrefix"
                  className="font-mono w-full p-2.5 cursor-pointer"
                >
                  <option value={"1"}>US(+1)</option>
                  {dialcodes
                    .sort((a, b) => {
                      if (a.code < b.code) return -1;
                      if (a.code > b.code) return 1;
                      return 0;
                    })
                    .map((code) =>
                      code.code === "US" ? null : (
                        <option
                          key={code.code}
                          value={code.dial_code.replace("+", "")}
                        >
                          {code.code}({code.dial_code})
                        </option>
                      )
                    )}
                </select>
              </div>
              <input
                required
                className="p-2 rounded-sm border"
                type="number"
                tabIndex={6}
                name="contactPhone"
                placeholder="1234567890"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-1">
          <label
            className="text-[#888] flex justify-between"
            htmlFor="companyName"
          >
            <div>Add Address</div>
            <div className="flex justify-center gap-3 text-xs">
              <div className="flex items-center gap-0.5">
                <input type="checkbox" name="companyAddressPrimary" id="" />
                <span>Primary</span>
              </div>
              <div className="flex items-center gap-0.5">
                <input type="checkbox" name="companyAddressHQ" id="" />
                <span>HQ</span>
              </div>
            </div>
          </label>
          <div className="grid gap-2">
            <input
              required
              className="p-2 rounded-sm border"
              type="text"
              tabIndex={7}
              name="companyStreetAddress"
              placeholder="Street Name"
            />
            <input
              required
              className="p-2 rounded-sm border"
              type="text"
              tabIndex={8}
              name="companyCity"
              placeholder="City"
            />
            <div className="w-full">
              <input
                required
                className="p-2 rounded-sm border w-full"
                type="text"
                tabIndex={9}
                name="companyZipCode"
                onChange={handleZipCodeChange}
                placeholder="ZIP Code"
              />
              <p className="text-xs text-rose-800" ref={zipCodeError}></p>
            </div>
            <input
              required
              className="p-2 rounded-sm border"
              type="text"
              tabIndex={10}
              name="companyStateCode"
              placeholder="State – 03"
            />
          </div>
        </div>

        <div className="flex justify-between pt-8">
          <button
            className="bg-rose-100 py-2 px-4 rounded cursor-pointer hover:bg-rose-200"
            onClick={(e) => {
              e.preventDefault();
              dispatch(closePanel());
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-200 py-2 px-4 rounded cursor-pointer hover:bg-blue-300"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
