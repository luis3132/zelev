export async function Get(url: string, token: string, body?: object, isBinary: boolean = false) {
    const options: RequestInit = {
        method: "GET",
        headers: {
            ...(token !== "" && { "Authorization": `Bearer ${token}` }),
            ...(!isBinary && { "Content-Type": "application/json" }),
        },
        ...(body && { body: JSON.stringify(body) })
    };
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}${url}`, options);
        if (!response.ok) {
            return { data: null, status: response.status, error: 'Error en la respuesta del servidor' };
        }

        if (isBinary) {
            // Para respuestas binarias (imágenes, archivos)
            const blob = await response.blob();
            return { data: blob, status: response.status };
        } else {
            // Para respuestas JSON
            const data = await response.json();
            return { data, status: response.status };
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return { data: null, status: 500, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function Post(url: string, token: string, body: object) {
    const options: RequestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token !== "" && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
    };
    let response;
    try {
        response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}${url}`, options);
    } catch (error) {
        console.error(error);
        return { data: "Error al Enviar los datos", status: 500 };
    }
    try {
        const data = await response.json();
        return { data: data, status: response.status };
    } catch (error) {
        console.warn('json error: ', error);
        return { data: { error: "Respuesta no es un objeto tipo JSON" }, status: response.status };
    }
}

export async function UploadPost(url: string, token: string, body: FormData) {
    const options: RequestInit = {
        method: "POST",
        headers: {
            ...(token !== "" && { "Authorization": `Bearer ${token}` }),
        },
        body: body,
    }
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}${url}`, options);
        const data = await response.json();
        return { data: data, status: response.status };
    } catch (error) {
        console.error(error);
        return { data: { error: "Error al Enviar los datos" }, status: 500 };
    }
}

export async function Put(url: string, token: string, body: object) {
    const options: RequestInit = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    };
    let response;
    try {
        response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}${url}`, options);
    } catch (error) {
        console.error(error);
        return { data: { error: "Error al actualizar los datos" }, status: 500 };
    }
    try {
        const data = await response.json();
        return { data: data, status: response.status };
    } catch (error) {
        console.warn('json error: ', error);
        return { data: { error: "Respuesta no es un objeto tipo JSON" }, status: response.status };
    }
}

export async function Delete(url: string, token: string, body?: object) {
    const options: RequestInit = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        ...(body && { body: JSON.stringify(body) })
    };
    let response;
    try {
        response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}${url}`, options);
    } catch (error) {
        console.error(error);
        return { data: { error: "Error al Eliminar los datos" }, status: 500 };
    }
    try {
        const data = await response.json();
        return { data: data, status: response.status };
    } catch (error) {
        console.warn('json error: ', error);
        return { data: { error: "Respuesta no es un objeto tipo JSON" }, status: response.status };
    }
}