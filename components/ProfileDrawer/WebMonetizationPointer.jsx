
import { useState } from "react";
import { Combobox } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import { EditIcon } from '../icons';
import { getPaymentPointer, setPaymentPointer } from '../../model/profile';

export const MysilioPointer = "$ilp.uphold.com/DYPhbXPmDa2P";

export const MonetizationPointers = [
  { name: "Mysilio", pointer: MysilioPointer },
  { name: "Defold Foundation", pointer: "$ilp.uphold.com/QkG86UgXzKq8" },
  { name: "freeCodeCamp", pointer: "$ilp.uphold.com/LJmbPn7WD4JB" },
  { name: "Internet Archive", pointer: "$ilp.uphold.com/D7BwPKMQzBiD" },
  { name: "STOP", pointer: "$ilp.uphold.com/RHZ6KZx4mWQi" },
  { name: "Ushandi", pointer: "$ilp.uphold.com/kN2KHpqhNFiM" },
  { name: "ITADI", pointer: "$ilp.uphold.com/kjMJqg7gH7JA" },
  { name: "Ballet Rising", pointer: "$ilp.uphold.com/4hyPF8hgjKMw" },
  {
    name: "Creative Living for Dancers",
    pointer: "$ilp.uphold.com/FR7UfwWWfib3",
  },
  {
    name: "Wellness Through Mindfullness Course",
    pointer: "$ilp.gatehub.net/735653594",
  },
];

const OrgsByPointer = MonetizationPointers.reduce((m, mp) => {
  m[mp.pointer] = mp.name
  return m
}, {})

export function orgForPointer(pointer) {
  return OrgsByPointer[pointer]
}

function randomPP() {
  return MonetizationPointers[
    Math.floor(Math.random() * MonetizationPointers.length)
  ];
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function MonetizationPicker({ setMonetization, currentValue }) {
  const [query, setQuery] = useState("");
  const [selectedPP, setSelectedPP] = useState(currentValue && { pointer: currentValue, name: currentValue });
  const setPP = (pp) => {
    setSelectedPP(pp);
    setMonetization(pp.pointer);
  };

  const inputOnChange = (value) => {
    setQuery(value)
    setSelectedPP({ pointer: value, name: value });
    setMonetization(value)
  }

  // don't use this for now, but may bring it back. clean if still here in a few weeks
  //useEffect(() => {
  //  setPP(randomPP());
  //}, []);

  const filteredPointers =
    query === ""
      ? MonetizationPointers
      : MonetizationPointers.filter((pp) => {
        return pp.name.toLowerCase().includes(query.toLowerCase());
      });

  return (
    <Combobox as="div" value={selectedPP || currentValue} onChange={setPP}>
      <Combobox.Label className="block text-sm font-medium text-white">
        Please enter or select a payment pointer
      </Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 text-gray-600 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => inputOnChange(event.target.value)}
          displayValue={(pp) => pp && pp.name}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredPointers.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-96 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredPointers.map((pp) => (
              <Combobox.Option
                key={pp.name}
                value={pp}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex">
                      <span
                        className={classNames(
                          "truncate",
                          selected && "font-semibold"
                        )}
                      >
                        {pp.name}
                      </span>
                      <span
                        className={classNames(
                          "ml-2 truncate text-gray-500",
                          active ? "text-indigo-200" : "text-gray-500"
                        )}
                      >
                        {pp.pointer}
                      </span>
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-indigo-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}

export default function WebMonetizationPointer({ profile, saveProfile, ...props }) {
  const paymentPointer = getPaymentPointer(profile);
  const [newPaymentPointer, setNewPaymentPointer] = useState();

  async function save(newPaymentPointer) {
    return await saveProfile(setPaymentPointer(profile, newPaymentPointer))
  }
  const [editingPaymentPointer, setEditingPaymentPointer] = useState(false);
  function savePaymentPointer() {
    save(newPaymentPointer);
    setEditingPaymentPointer(false);
  }
  function onEdit() {
    setNewPaymentPointer(paymentPointer);
    setEditingPaymentPointer(true);
  }
  return (
    <div {...props}>
      {editingPaymentPointer ? (
        <div className="flex flex-row items-end gap-2">
          <MonetizationPicker setMonetization={setNewPaymentPointer} currentValue={paymentPointer} />
          <button className="btn-md btn-filled" onClick={savePaymentPointer}>
            Save
          </button>
        </div>
      ) : (
        <div className="relative flex flex-row">
          <h3 className="text-base text-center mb-3">
            {paymentPointer || (
              <span className="text-gray-500" onClick={onEdit}>
                click to set payment pointer
              </span>
            )}
          </h3>
          {paymentPointer && (
            <EditIcon className="relative -right-1 -top-2 text-purple-300 cursor-pointer w-4 h-4"
              onClick={onEdit} />
          )}
        </div>
      )}
    </div>
  );
}
