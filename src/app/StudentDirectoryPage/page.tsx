"use client";
import { IToken } from "@/Interfaces/Interface";
import FooterComponent from "@/components/FooterComponent/page";
import NavbarComponent from "@/components/NavbarComponent";
import { useAppContext } from "@/context/Context";
import { Button } from "flowbite-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import InputMask from "react-input-mask";

interface IStudentData {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email: string;
  dob: string;
  isAdmin: boolean;
  isDeleted: boolean;
}

interface IUpdateStudent {
  id: number;
  isDeleted: boolean;
  email: boolean;
  isAdmin: boolean;
}

const StudentDirectoryPage = () => {
  const [modal, setModal] = useState(false);
  const [data, setData] = useState<any>(null);
  const [editModal, setEditModal] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [toggleABC, setToggleABC] = useState(true);
  const [toggleLoad, setToggleLoad] = useState(true);
  const [chooseSearch, setChooseSearch] = useState("firstName");
  const [startCut, setStartCut] = useState<number>(0);
  const [endCut, setEndCut] = useState<number>(10);
  const [currentStudent, setCurrentStudent] = useState<IStudentData>();
  const [hideModel, setHideModel] = useState("hidden");
  const [hideEditModel, setEditHideModel] = useState("hidden");
  const [saveArr, setSaveArr] = useState<IStudentData[] | any>();

  const [seedData, setSeedData] = useState<IStudentData[] | any>();

  const router = useRouter();

  const handleForward = () => {
    if (seedData.length > endCut) {
      setStartCut(startCut + 10);
      setEndCut(endCut + 10);
    }
  };
  const handleBack = () => {
    if (startCut > 0) {
      setStartCut(startCut - 10);
      setEndCut(endCut - 10);
    }
  };

  const FetchAllUsers = async () => {
    const res = await fetch(
      "https://williamform.azurewebsites.net/Form/GetAllForms"
    );
    const data = await res.json();
    return data;
  };

  const softDeleteUser = async (profileData: IStudentData | any) => {
    console.log("bye");
    const res = await fetch(
      "https://williamform.azurewebsites.net/Form/UpdateForm",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      }
    );

    if (!res.ok) {
      const message = "An error has Occurred " + res.status;
      throw new Error(message);
    }

    const data = await res.json();
    return data;
  };

  const removeStudentWithoutRefetching = (studentId: number | undefined) => {
    let copyArr: IStudentData[] = [...seedData];

    for (let i = copyArr.length - 1; i >= 0; i--) {
      if (copyArr[i].id === studentId) {
        copyArr.splice(i, 1);
        setSeedData(copyArr);
        break;
      }
    }
  };

  const replaceStudentWithoutRefetching = (
    studentId: number | undefined,
    studentObject: IStudentData | any
  ) => {
    let copyArr: IStudentData[] = [...seedData];

    for (let i = copyArr.length - 1; i >= 0; i--) {
      if (copyArr[i].id === studentId) {
        copyArr.splice(i, 1, studentObject);
        setSeedData(copyArr);
        break;
      }
    }
  };

  const SortByAlpha = (selectedField: string) => {
    if (seedData && toggleABC) {
      const sorted = [...seedData].sort((a, b) => {
        if (
          a[selectedField][0].toLocaleLowerCase() <
          b[selectedField][0].toLocaleLowerCase()
        ) {
          return -1;
        }
        if (
          a[selectedField][0].toLocaleLowerCase() >
          b[selectedField][0].toLocaleLowerCase()
        ) {
          return 1;
        }
        return 0;
      });
      setSeedData(sorted);
      setToggleABC(!toggleABC);
    } else if (seedData && !toggleABC) {
      const sorted = [...seedData].sort((a, b) => {
        if (
          a[selectedField][0].toLocaleLowerCase() >
          b[selectedField][0].toLocaleLowerCase()
        ) {
          return -1;
        }
        if (
          a[selectedField][0].toLocaleLowerCase() <
          b[selectedField][0].toLocaleLowerCase()
        ) {
          return 1;
        }
        return 0;
      });
      setSeedData(sorted);
      setToggleABC(!toggleABC);
    }
  };

  const SortByDate = () => {
    if (seedData && toggleABC) {
      const sorted = [...seedData].sort((a, b) => {
        const dateA = new Date(a.dob).getTime();
        const dateB = new Date(b.dob).getTime();
        return dateA - dateB;
      });
      setSeedData(sorted);
      setToggleABC(!toggleABC);
    } else if (seedData && !toggleABC) {
      const sorted = [...seedData].sort((a, b) => {
        const dateA = new Date(a.dob).getTime();
        const dateB = new Date(b.dob).getTime();
        return dateB - dateA;
      });
      setSeedData(sorted);
      setToggleABC(!toggleABC);
    }
  };

  useEffect(() => {
    const session = sessionStorage.getItem("WA-SessionStorage");
    setData(session ? JSON.parse(session) : null);
    CheckToken(session ? JSON.parse(session) : null);

    const loadAll = async () => {
      let copyArr = await FetchAllUsers();
      setSeedData(copyArr);
      setSaveArr(copyArr);
    };
    loadAll();
  }, []);

  const CheckToken = (data: IToken | null) => {
    if ((data !== null && data.token === null) || data === null) {
      router.push("/");
    }
  };

  const handleSearch = (e: any) => {
    const copyArr = saveArr.filter((student: IStudentData | any) =>
      student?.[chooseSearch]
        ?.toLocaleLowerCase()
        .includes(e.toLocaleLowerCase())
    );
    setSeedData(copyArr);
  };

  const [form, setForm] = useState<any>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
    dob: "",
    isDeleted: false,
  });

  const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    //passing through its current values, and updating
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(form);
  };

  return (
    <div>
      <div
        className={`flex justify-center md:items-center bg-[#00000089] h-full w-screen fixed ${hideEditModel} `}
      >
        <div className={`bg-white mt-4 p-[24px] relative h-fit `}>
          <p className=" text-[20px] md:text-[30px] text-center mb-2 md:mb-6 font-bold">
            UPDATE {currentStudent?.firstName.toUpperCase()}S INFORMATION
          </p>
          <div className=" grid gap-x-10 md:gap-y-2 grid-cols-1 md:grid-cols-2">
            <div className=" mx-auto w-full">
              <label className=" w-fit rounded font-normal text-slate-600">
                First Name
              </label>
              <input
                placeholder="First Name"
                type="text"
                name="firstName"
                className="border w-full text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-8 px-12"
                value={form?.firstName}
                onChange={updateForm}
              />
            </div>

            <div className=" mx-auto w-full">
              <label className=" w-fit rounded font-normal text-slate-600">
                Last Name
              </label>
              <input
                placeholder="Last Name"
                type="text"
                name="lastName"
                className="border w-full text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-8 px-12"
                value={form?.lastName}
                onChange={updateForm}
              />
            </div>

            <div className=" mx-auto w-full">
              <label className=" w-fit rounded font-normal text-slate-600">
                Address
              </label>
              <input
                placeholder="Address"
                type="text"
                name="address"
                className="border w-full text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-8 px-12"
                value={form?.address}
                onChange={updateForm}
              />
            </div>

            <div className=" mx-auto w-full">
              <label className="w-fit rounded font-normal text-slate-600">
                Phone Number
              </label>
              <div className="flex flex-col relative">
                <InputMask
                  className={`${
                    /\([0-9]{3}\)-[0-9]{3}-[0-9]{4}/.test(form?.phoneNumber) ===
                      false && form?.phoneNumber.length > 0
                      ? "border border-red-500"
                      : ""
                  } border w-full text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-8 px-12`}
                  placeholder="(xxx)-xxx-xxxx"
                  autoComplete="tel"
                  mask="(999)-999-9999"
                  value={form?.phoneNumber}
                  onChange={updateForm}
                  id="phonenumber"
                  name="phoneNumber"
                ></InputMask>
              </div>
            </div>

            <div className=" mx-auto w-full ">
              <label className=" w-fit rounded font-normal text-slate-600">
                Date of Birth
              </label>
              <input
                placeholder="Date of Birth"
                type="date"
                name="dob"
                className="border text-center bg-[#ECF0F1] w-full p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-8"
                value={form?.dob}
                onChange={updateForm}
              />
            </div>

            <div className=" mx-auto w-full">
              <label className=" w-fit rounded font-normal text-slate-600">
                Email
              </label>
              <input
                placeholder="First Name"
                type="text"
                name="email"
                className="border w-full text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-8 px-12"
                value={form?.email}
                onChange={updateForm}
              />
            </div>
          </div>

          <div className=" flex justify-end gap-x-5 mt-2 md:mt-6">
            <button
              className=" text-white w-[100px] h-[40px] font-semibold bg-[#737375]"
              onClick={() => setEditHideModel("hidden")}
            >
              CANCEL
            </button>

            <button
              className=" text-white w-[100px] h-[40px] font-semibold bg-[#DD8A3E]"
              onClick={async () => {
                setEditHideModel("hidden");

                replaceStudentWithoutRefetching(currentStudent?.id, form);
                await softDeleteUser({
                  id: form?.id,
                  firstName: form?.firstName,
                  lastName: form?.lastName,
                  address: form?.address,
                  phoneNumber: form?.phoneNumber,
                  dob: form?.dob,
                  email: form?.email,
                  isDeleted: form?.isDeleted,
                });
              }}
            >
              UPDATE
            </button>
          </div>
        </div>
      </div>

      <div
        className={`flex justify-center items-center bg-[#00000089] h-screen w-screen fixed ${hideModel}`}
      >
        <div className={`bg-white p-5`}>
          <p className="text-center pb-5">
            Are you sure you want to remove {currentStudent?.firstName}
          </p>
          <div className="flex justify-evenly">
            <button
              className="text-white w-[100px] h-[50px] font-semibold bg-[#737375]"
              onClick={() => setHideModel("hidden ")}
            >
              CANCEL
            </button>
            <button
              className="text-white w-[100px] h-[50px] font-semibold bg-[#DD8A3E]"
              onClick={async () => {
                setHideModel("hidden");
                removeStudentWithoutRefetching(currentStudent?.id);
                await softDeleteUser({
                  id: currentStudent?.id,
                  firstName: currentStudent?.firstName,
                  lastName: currentStudent?.lastName,
                  address: currentStudent?.address,
                  phoneNumber: currentStudent?.phoneNumber,
                  dob: currentStudent?.dob,
                  email: currentStudent?.email,
                  isDeleted: true,
                });
              }}
            >
              DELETE
            </button>
          </div>
        </div>
      </div>

      <NavbarComponent admin={data !== null && data.isAdmin} />

      <div>
        <div className="flex flex-col items-center w-fit max-w-[1396px] mx-auto over">
          <div className=" mr-auto xl:px-0 px-5">
            <input
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
              type="text"
              className="border my-5 me-5"
            />
            <select
              onChange={(e) => {
                setChooseSearch(e.target.value);
              }}
            >
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
              <option value="dob">Date of Birth</option>
              <option value="email">Email</option>
              <option value="phoneNumber">Phone Number</option>
              <option value="address">Address</option>
            </select>
          </div>

          <div className="w-screen overflow-x-auto flex px-5 xl:px-0 xl:justify-center mt-5">
            <div className="min-h-[510px] max-w-[1396px] ">
              <table className=" border border-black ">
                <thead className="text-white text-[20px] bg-[#23527C] gap-2">
                  <tr>
                    <th
                      className="py-2 text-start font-normal overflow-hidden px-2 min-w-48 "
                      onClick={() => {
                        SortByAlpha("firstName");
                      }}
                    >
                      <p className=" hover:cursor-pointer w-fit"> First Name</p>
                    </th>
                    <th
                      className="text-start font-normal overflow-hidden px-2 min-w-48"
                      onClick={() => {
                        SortByAlpha("lastName");
                      }}
                    >
                      <p className=" hover:cursor-pointer w-fit">Last Name</p>
                    </th>
                    <th
                      className="text-start font-normal overflow-hidden px-2 min-w-48"
                      onClick={() => {
                        SortByDate();
                      }}
                    >
                      <p className=" hover:cursor-pointer w-fit">
                        Date of Birth
                      </p>
                    </th>
                    <th className="text-start font-normal overflow-hidden px-2 min-w-48">
                      Address
                    </th>
                    <th
                      className="text-start font-normal overflow-hidden px-2 w-80"
                      onClick={() => {
                        SortByAlpha("email");
                      }}
                    >
                      Email
                    </th>
                    <th className="text-start font-normal overflow-hidden px-2 min-w-48">
                      <p className=" hover:cursor-pointer w-fit">
                        Phone Number
                      </p>
                    </th>
                    <th className="font-normal min-w-20"></th>
                  </tr>
                </thead>

                <tbody>
                  {seedData &&
                    seedData
                      .slice(startCut, endCut)
                      .map((student: IStudentData | any, idx: number) => {
                        return (
                          <tr
                            key={idx}
                            className={` h-[45px] ${
                              idx % 2 == 0 ? "" : "bg-white"
                            }  `}
                          >
                            <td className="overflow-hidden px-2">
                              {student.firstName ? student.firstName : "N/A"}
                            </td>
                            <td className="overflow-hidden px-2">
                              {student.lastName ? student.lastName : "N/A"}
                            </td>
                            <td className="overflow-hidden px-2">
                              {student?.dob ? student?.dob : "N/A"}
                            </td>
                            <td className=" overflow-hidden px-2">
                              {student?.address ? student?.address : "N/A"}
                            </td>
                            <td className="overflow-hidden px-2">
                              {student?.email ? student?.email : "N/A"}
                            </td>
                            <td className="overflow-hidden px-2">
                              {student?.phoneNumber
                                ? student?.phoneNumber
                                : "N/A"}
                            </td>
                            {data && data.isAdmin && (
                              <td className=" flex flex-row items-center p-2 gap-2">
                                <Image
                                  onClick={() => {
                                    setCurrentStudent(student);
                                    setHideModel("block");
                                  }}
                                  src="/Trash.png"
                                  alt="Delete"
                                  width={30}
                                  height={30}
                                  className="cursor-pointer"
                                />
                                <Image
                                  onClick={() => {
                                    setForm(student);
                                    setCurrentStudent(student);
                                    setEditHideModel("block");
                                  }}
                                  src="/Edit.png"
                                  alt='"Edit'
                                  width={25}
                                  height={25}
                                  className="cursor-pointer"
                                />
                              </td>
                            )}
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="my-5 flex max-w-[1396px] px-5 xl:px-0 justify-between w-full ">
            <button
              className=" bg-[#23527C] w-[94px] h-[36px] px-[16px] py-[8px] text-white rounded-none "
              onClick={handleBack}
            >
              Back
            </button>
            <button
              className=" bg-[#23527C] h-[36px] px-[16px] py-[8px] text-white rounded-none "
              onClick={handleForward}
            >
              Forward
            </button>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default StudentDirectoryPage;
