import DepartamentosyCiudades from "@/lib/types/departamentosyciudades"


export default function Departamentos() {
    const departamentos = DepartamentosyCiudades;
    return (
        <>
            <option value="" selected>Seleccione un departamento</option>
            {departamentos.map((departamento, i) => (
                <option key={i} value={departamento.departamento}>
                    {departamento.departamento}
                </option>
            ))}
        </>
    )
}