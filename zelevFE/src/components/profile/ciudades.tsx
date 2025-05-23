import DepartamentosyCiudades from "@/lib/types/departamentosyciudades"

interface CiudadesProps {
    departamento: string | undefined;
}

const Ciudades = ({ departamento }: CiudadesProps) => {
    const departamentos = DepartamentosyCiudades.find((d) => d.departamento === departamento);
    
    if (departamentos) {
        return (
            <>
                <option defaultValue="" >Seleccione una ciudad</option>
                {departamentos?.ciudades.map((ciudad, i) => (
                    <option key={i} value={ciudad}>
                        {ciudad}
                    </option>
                ))}
            </>
        )
    }
    return (
        <>
            <option defaultValue="" >Seleccione un Departamento</option>
        </>
    )
}

export default Ciudades;