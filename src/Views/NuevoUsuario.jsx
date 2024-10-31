import { useRoles } from "../Hooks/useRoles"


export const NuevoUsuario = () => {

  const { roles } = useRoles();



  return(
    <div>
      <h1>Agregar Usuario</h1>
    </div>
  )
}