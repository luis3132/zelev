import DepartamentosyCiudades from "@/lib/types/departamentosyciudades"


export default function Departamentos() {
    const departamentos = DepartamentosyCiudades;
    return (
        <>
            <option defaultValue="">Seleccione un Departamento</option>
            {departamentos.map((departamento, i) => (
                <option key={i} value={departamento.departamento}>
                    {departamento.departamento}
                </option>
            ))}
        </>
    )
}