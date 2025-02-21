import axios from "@/axios";

// 登录接口
export function login(email, password) {
    return axios.post("/login", { email, password });
}

// 获取用户信息
export function getUserInfo() {
    return axios.post("/admin/user/info/findCurrent");
}

// 修改密码
export function modifyPassword(username, password) {
    return axios.post("/admin/user/password/update", {username, password});
}