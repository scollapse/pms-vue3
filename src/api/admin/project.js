import axios from "@/axios";

// 获取项目列表
export function fetchProjects(data) {
    return axios.post("/interface/admin/project/list", 
        data
    );
}

// 新增项目
export function addProject(data) {
    return axios.post("/interface/admin/project/add", 
        data
    );
}

// 更新项目
export function updateProject(data) {
    return axios.post("/interface/admin/project/update", 
        data
    );
}

// 删除项目
export function deleteProject(data) {
    return axios.post("/interface/admin/project/delete", 
        data
    );
}

// 添加完成项目的接口
export function finishProject(data) {
    return axios.post("/interface/admin/project/finish", 
        data
    );
} 