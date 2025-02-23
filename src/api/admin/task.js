import axios from "@/axios";

// 获取任务列表
export function fetchTasks(data) {

    return axios.post("/interface/admin/task/list", 
        data
    );
}

// 新增任务
export function addTask  (data) {
    return axios.post("/interface/admin/task/add", 
        data
    );
}

// 更新任务
export function updateTask  (data) {
    return axios.post("/interface/admin/task/update", 
        data
    );
}

// 删除任务
export function deleteTask (data)  {
    return axios.post("/interface/admin/task/delete", 
        data
    );
}

// 添加完成任务的接口
export function finishTask(data) {
    return axios.post("/interface/admin/task/finish", 
        data
    );
} 