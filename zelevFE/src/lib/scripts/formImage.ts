import { UploadPost } from "./fetch";

const FormImagen = async (file: File, existe: string, alt: string, token: string) => {
    const formData = new FormData();
    formData.append("imagen", file);
    formData.append("ruta", "profile");
    formData.append("existe", existe);
    formData.append("alt", alt);
    const { data, status } = await UploadPost("/api/imagen/upload", token, formData);
    return { data, status };
}

export default FormImagen;