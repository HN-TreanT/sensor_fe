import CreateApiService from "../createApiServices"

const api = CreateApiService();

const get = (params) => {
    return api.makeAuthRequest({
        url: `/api/cluster`,
        method: "GET",
        params: params
    });
};

const getById = (id) => {
    return api.makeAuthRequest({
        url: `/api/cluster/${id}`,
        method: "GET",
    });
};

const create = (data) => {
    return api.makeAuthRequest({
        url: "/api/cluster",
        method: "POST",
        data: data,
    });
};

const update = (id, data) => {
    return api.makeAuthRequest({
        url: `/api/cluster/${id}`,
        method: "PUT",
        data: data,
    });
};

const deleteById = (id) => {
    return api.makeAuthRequest({
        url: `/api/cluster/${id}`,
        method: "DELETE",
    });
};

export const clusterServices = {
    get,
    getById,
    create,
    update,
    deleteById,
};
