import { NewStaff, passwordUpdate } from "@/interfaces/staff";
import { loginOneApi, usersBaseEndpoint } from "./axios";
export const getAllUsers = async (searchValues: string) => {
  try {
    const response = await loginOneApi.get(
      usersBaseEndpoint + `?search=${searchValues}`
    );
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
export const addNewUser = async (data: NewStaff) => {
  try {
    const response = await loginOneApi.post(usersBaseEndpoint, data);
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.log(err);
  }
};
export const deleteUser = async (id: number) => {
  try {
    const response = await loginOneApi.delete(usersBaseEndpoint + `/${id}`);
    return response.data.message;
  } catch (err) {
    console.log(err);
  }
};
export const getUser = async (id: number) => {
  try {
    const response = await loginOneApi.get(usersBaseEndpoint + `/${id}`);
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
export const updateUser = async (id: number, data: NewStaff) => {
  try {
    const response = await loginOneApi.put(usersBaseEndpoint + `/${id}`, data);
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.log(err);
  }
};
export const sendPasswordResetLink = async ({ email }: { email: string }) => {
  try {
    const response = await loginOneApi.post(usersBaseEndpoint + `/resetlink`, {
      email,
    });
    return response.data.message;
  } catch (err) {
    console.log(err);
  }
};
export const setNewPassword = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  try {
    const response = await loginOneApi.post(
      usersBaseEndpoint + `/resetlink/newpassword`,
      {
        token,
        password,
      }
    );
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.log(err);
  }
};

export const getAllAgents = async () => {
  try {
    const response = await loginOneApi.get(usersBaseEndpoint + `/agents`);
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
export const RegistreSalesAgent = async (data: NewStaff) => {
  try {
    const response = await loginOneApi.post(usersBaseEndpoint + `/agents`, data);
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.log(err);
  }
};

export const updatePassword = async (data: passwordUpdate) => {
  try {
    const response = await loginOneApi.put(
      usersBaseEndpoint + `/resetlink/newpassword`,
      data
    );
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.log(err);
  }
};
