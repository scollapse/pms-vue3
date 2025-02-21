import axios from "@/axios";

export function fetchTags(data) {
    return axios.post("/interface/admin/tag/list", 
        data
    );
}

export function addTag(data) {
    return axios.post("/interface/admin/tag/add", 
        data
    );
}

export function deleteTag(data) {
    return axios.post("/interface/admin/tag/delete", 
        data
    );
}
