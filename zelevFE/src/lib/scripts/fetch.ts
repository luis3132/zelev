export default async function Get(url: string, token: string, body?: object) {
    const options: RequestInit = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}${url}`, options);
        const data = await response.json();
        return { data: { data }, status: response.status };
    } catch (error) {
        console.error(error);
        return { data: { error: "Error al traer los datos" }, status: 500 };
    }
}

export async function Post(url: string, token: string, body?: object) {
    let options: RequestInit;
    if (token === "") {
        options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        };
    } else {
        options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        };
    }
    if (body) {
        options.body = JSON.stringify(body);
    }
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}${url}`, options);
        const data = await response.json();
        return { data: { data }, status: response.status };
    } catch (error) {
        console.error(error);
        return { data: { error: "Error al traer los datos" }, status: 500 };
    }
}

export async function Put(url: string, token: string, body?: object) {
    const options: RequestInit = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}${url}`, options);
        const data = await response.json();
        return { data: { data }, status: response.status };
    } catch (error) {
        console.error(error);
        return { data: { error: "Error al traer los datos" }, status: 500 };
    }
}

export async function Delete(url: string, token: string, body?: object) {
    const options: RequestInit = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}${url}`, options);
        const data = await response.json();
        return { data: { data }, status: response.status };
    } catch (error) {
        console.error(error);
        return { data: { error: "Error al traer los datos" }, status: 500 };
    }
}