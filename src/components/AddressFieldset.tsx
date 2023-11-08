import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  finishedAddingContactOrAddress,
  setAddingAnotherAddress,
  setAddingAnotherContact,
  setEditingAddressID,
  setEditingContactID,
} from "../app/customer.slice";

export default function AddressFieldset() {
  const dispatch = useDispatch();
  const addressIDRef = useRef<number>();

  const [addresses, setAddresses] = useState([]);
  const { customerSelected, addingAnotherContact, editingAddressID } = useSelector(
    (state: any) => state.customers
  );

  const chooseAddress = function (index, addressID) {
    dispatch(finishedAddingContactOrAddress());

    addingAnotherContact
      ? dispatch(
          setEditingContactID({
            index: index,
            AddressID: addressID,
          })
        )
      : dispatch(
          setEditingAddressID({
            index: index,
            AddressID: addressID,
          })
        );
  };

  useEffect(
    function () {
      const addresses = customerSelected.map((customer, _) => {
        if (addressIDRef.current != customer.AddressID) {
          addressIDRef.current = customer.AddressID;

          return (
            <details
              className="border-b pb-1 mb-3"
              key={`${customer.AddressID}_${customer.CompanyStreetAddress}`}
            >
              <summary className="flex gap-2">
                <input type="checkbox" />
                <span>{customer.CompanyStreetAddress}</span>
              </summary>

              <div className="grid pt-2">
                <div className="flex justify-between pt-1">
                  <span className="text-[#888]">Street Name</span>
                  <span className="flex gap-2">
                    <div>{customer.CompanyStreetAddress}</div>
                    <img
                      className="cursor-pointer"
                      src="/svgs/pencil.icon.svg"
                      alt="Pencil Icon"
                      onClick={() => chooseAddress(_, customer.AddressID)}
                    />
                  </span>
                </div>
              </div>
            </details>
          );
        }
      });

      addressIDRef.current = undefined;
      setAddresses(addresses);
    },
    [addingAnotherContact, editingAddressID, customerSelected]
  );

  function addAddress() {
    dispatch(setAddingAnotherContact(false));
    dispatch(setAddingAnotherAddress(true));
  }

  return (
    <fieldset className="border p-4 pt-2 rounded border-gray-300">
      <legend>
        <div className="px-2">List of Addresses</div>
      </legend>
      <div className="bg-white rounded pt-3 p-4 max-h-[273.5px] h-full shadow-sm grid grid-rows-[1fr_auto]">
        <div className="h-full">{addresses.map((address) => address)}</div>

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
