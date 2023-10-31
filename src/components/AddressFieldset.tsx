import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAddingAnotherAddress,
  setEditingAddressID,
} from "../app/customer.slice";

export default function AddressFieldset() {
  const dispatch = useDispatch();
  const { customerSelected } = useSelector((state: any) => state.customers);

  function addAddress() {
    dispatch(setAddingAnotherAddress(true));
  }

  function setEditingAddressIDValue(index: number) {
    dispatch(setEditingAddressID(index));
  }

  return (
    <fieldset className="border p-4 pt-2 rounded border-gray-300">
      <legend>
        <div className="px-2">List of Addresses</div>
      </legend>
      <div className="bg-white rounded pt-3 p-4 max-h-[273.5px] h-full shadow-sm grid grid-rows-[1fr_auto]">
        <div className="h-full">
          {customerSelected.addresses.map((address, _) => (
            <details
              className="border-b pb-1 mb-3"
              key={`${address.AddressID}_${address.CompanyStreetAddress}`}
            >
              <summary className="flex gap-2">
                <input type="checkbox" />
                <span>{address.CompanyStreetAddress}</span>
              </summary>

              <div className="grid pt-2">
                <div className="flex justify-between pt-1">
                  <span className="text-[#888]">Street Name</span>
                  <span className="flex gap-2">
                    <div>{address.CompanyStreetAddress}</div>
                    <img
                      className="cursor-pointer"
                      onClick={() => setEditingAddressIDValue(_)}
                      src="/svgs/pencil.icon.svg"
                      alt="Pencil Icon"
                    />
                  </span>
                </div>
              </div>
            </details>
          ))}
        </div>

        <div className="flex justify-end h-max">
          <button
            onClick={addAddress}
            className="bg-blue-200 p-1 rounded px-2.5"
          >
            +
          </button>
        </div>
      </div>
    </fieldset>
  );
}
