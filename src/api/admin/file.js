import axios from "@/axios";

// 上传文件
export function uploadFile(data) {
    return axios.post("/interface/admin/file/upload", data,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
 