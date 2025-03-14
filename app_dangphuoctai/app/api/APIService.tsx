import axios, { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// export const IP_Address = "localhost";
export const IP_Address = "192.168.1.5";

export const URL_IMAGE =
  "http://" + IP_Address + ":8080/api/public/users/avatar/";
let API_URL = "http://" + IP_Address + ":8080/api";

async function getToken() {
  return await AsyncStorage.getItem("jwt-token");
}

export async function callApi(
  endpoint: string,
  method: string,
  data: any = null
): Promise<AxiosResponse<any>> {
  const token = await getToken();

  return axios({
    method,
    url: `${API_URL}/${endpoint}`,
    data,
    headers: {
      Authorization: token ? `Bearer ${token}` : "", // Include token if available
    },
  });
}

export function GET_ALL(endpoint: string): Promise<AxiosResponse<any>> {
  return callApi(endpoint, "GET");
}

export function GET_PAGE(
  endpoint: string,
  page: number = 0,
  size: number = 10,
  sortBy: string | null = null,
  sortOrder: string | null = null
): Promise<AxiosResponse<any>> {
  const params = new URLSearchParams();
  page && params.append("pageNumber", String(page));
  size && params.append("pageSize", String(size));
  sortBy && params.append("sortBy", sortBy);
  sortOrder && params.append("sortOrder", sortOrder);

  let url = `${endpoint}?${params.toString()}`;

  return callApi(url, "GET");
}

export function GET_ID(
  endpoint: string,
  id: string | number
): Promise<AxiosResponse<any>> {
  return callApi(`${endpoint}/${id}`, "GET");
}

export function POST_ADD(
  endpoint: string,
  data: any
): Promise<AxiosResponse<any>> {
  return callApi(endpoint, "POST", data);
}

export function PUT_EDIT(
  endpoint: string,
  data: any
): Promise<AxiosResponse<any>> {
  return callApi(endpoint, "PUT", data);
}

export function DELETE_ID(
  endpoint: string,
  id: string | number
): Promise<AxiosResponse<any>> {
  return callApi(`${endpoint}/${id}`, "DELETE");
}

export function GET_IMG(endpoint: string, imgName: string): string {
  return `${API_URL}/image/${endpoint}/${imgName}`;
}
export async function PUT_IMG(
  endpoint: string,
  data: any
): Promise<AxiosResponse<any>> {
  const token = await getToken();
  console.log(`${API_URL}/${endpoint}`);
  return axios({
    method: "PUT",
    url: `${API_URL}/${endpoint}`,
    data: data,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "multipart/form-data",
    },
  });
}
export async function POST_LOGIN(
  data: any,
  loginType: string
): Promise<boolean> {
  try {
    const response = await axios({
      method: "POST",
      url: `${API_URL}/auth/${loginType}`,
      data,
    });
    // const response = await callApi("login", "POST", data);
    const token = response.data["jwt-token"];
    if (token) {
      await AsyncStorage.setItem("jwt-token", token);
      const res = await callApi("public/users/email/token", "GET");
      if (res.status == 201 || res.status == 200) {
        await AsyncStorage.setItem("userId", String(res.data.userId));
        await AsyncStorage.setItem("email", String(res.data.email));
        return true;
      } else {
        alert("Đăng nhập thất bại, vui lòng thử lại.");
      }
    } else {
      alert("Đăng nhập thất bại, vui lòng thử lại.");
    }
  } catch (error) {
    console.log("Login error:", error);
    alert("Đăng nhập thất bại, vui lòng thử lại.");
    // alert("Có lỗi xảy ra khi đăng nhập.");
  }
  return false;
}
export function formatDateTime(inputDate: string) {
  const now = new Date();
  const date = new Date(inputDate);

  const isSameDay = now.toDateString() === date.toDateString();
  if (isSameDay) {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - now.getDay()); // Lấy ngày đầu tuần (Chủ nhật)
  const oneWeekLater = new Date(now);
  oneWeekLater.setDate(now.getDate() + (6 - now.getDay())); // Lấy ngày cuối tuần (Thứ 7)

  if (date >= oneWeekAgo && date <= oneWeekLater) {
    return date.toLocaleDateString("vi-VN", { weekday: "long" });
  }

  if (now.getFullYear() === date.getFullYear()) {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  }

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
export const timeAgo = (dateString: string): string => {
  const pastDate = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;

  const weeks = Math.floor(days / 7);
  if (weeks < 52) return `${weeks} tuần trước`;

  return `${Math.floor(weeks / 52)} năm trước`;
};
