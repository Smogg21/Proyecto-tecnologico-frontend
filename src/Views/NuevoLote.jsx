import { useContext, useState} from "react";
import Select from "react-select";
import { useProductos } from "../Hooks/useProductos";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export const NuevoLote = () => {
  const productos = useProductos();
  const opciones = productos.map((producto) => ({
    value: producto.IdProducto,
    label: producto.Nombre,
  }));
  const { auth } = useContext(AuthContext);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formValues, setFormValues] = useState({
    fechaCaducidad: "",
    fechaEntrada: "",
    cantidad: "",
    notas: "",
    idUsuario: "",
  });
  const [serialNumbers, setSerialNumbers] = useState([]);
  const navigate = useNavigate();
  const regresar = () => {
    navigate("/VistaOperador");
  };
  const [mensaje, setMensaje] = useState(null);

  const handleSelectChange = (selected) => {
    setSelectedOption(selected);
    const selectedProd = productos.find((p) => p.IdProducto === selected.value);
    setSelectedProduct(selectedProd);
    // Resetear campos al cambiar de producto
    setFormValues({ ...formValues, cantidad: "" });
    setSerialNumbers([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    // Manejar cambios en la cantidad
    if (name === "cantidad" && selectedProduct && selectedProduct.HasNumSerie) {
      const qty = parseInt(value, 10) || 0;
      const serials = Array(qty).fill("");
      setSerialNumbers(serials);
    }
  };

  const handleSerialNumberChange = (e, index) => {
    const newSerialNumbers = [...serialNumbers];
    newSerialNumbers[index] = e.target.value;
    setSerialNumbers(newSerialNumbers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que se haya seleccionado un producto
    if (!selectedOption) {
      setMensaje({
        tipo: "error",
        texto: "Por favor, selecciona un producto.",
      });
      return;
    }

    // Validar que la cantidad sea positiva
    const cantidadInt = parseInt(formValues.cantidad, 10);
    if (isNaN(cantidadInt) || cantidadInt <= 0) {
      setMensaje({
        tipo: "error",
        texto: "La cantidad debe ser un número entero positivo.",
      });
      return;
    }

    // Validar números de serie si el producto los maneja
    if (selectedProduct && selectedProduct.HasNumSerie) {
      if (serialNumbers.some((serial) => serial.trim() === "")) {
        setMensaje({
          tipo: "error",
          texto: "Por favor, ingresa todos los números de serie.",
        });
        return;
      }
    }

    const usuario = auth.user.IdUsuario;
    // Preparar los datos a enviar
    const dataToSend = {
      producto: selectedOption.value,
      fechaCaducidad: formValues.fechaCaducidad || null,
      fechaEntrada: formValues.fechaEntrada || null,
      cantidad: formValues.cantidad,
      notas: formValues.notas || null,
      idUsuario: usuario,
    };

    if (selectedProduct && selectedProduct.HasNumSerie) {
      dataToSend.serialNumbers = serialNumbers;
    }

    try {
      const response = await fetch("http://localhost:5000/api/lotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        setMensaje({
          tipo: "exito",
          texto: `Lote creado con éxito. ID: ${result.IdLote}`,
        });
        // Resetear el formulario
        setSelectedOption(null);
        setSelectedProduct(null);
        setFormValues({
          fechaCaducidad: "",
          fechaEntrada: "",
          cantidad: "",
          notas: "",
        });
        setSerialNumbers([]);
      } else {
        const error = await response.json();
        setMensaje({
          tipo: "error",
          texto: error.message || "Error al crear el lote.",
        });
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setMensaje({
        tipo: "error",
        texto: "Error al conectar con el servidor.",
      });
    }
  };

  const selectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#4a4a4a",
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#221f22",
      color: "white",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#221f22"
        : state.isFocused
        ? "black"
        : "gray",
      color: "white",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#333",
        color: "white",
        borderRadius: "8px",
      }}
    >
      <h1>Nuevo Lote</h1>
      {mensaje && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            color: mensaje.tipo === "exito" ? "green" : "red",
            border: `1px solid ${mensaje.tipo === "exito" ? "green" : "red"}`,
            borderRadius: "4px",
            backgroundColor: mensaje.tipo === "exito" ? "#d4edda" : "#f8d7da",
          }}
        >
          {mensaje.texto}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <label style={{ marginBottom: "5px" }}>Producto</label>
        <Select
          options={opciones}
          value={selectedOption}
          onChange={handleSelectChange}
          styles={selectStyles}
          placeholder="Busca un Producto"
        />

        <label style={{ marginTop: "10px", marginBottom: "5px" }}>
          Fecha de Caducidad
        </label>
        <input
          type="date"
          name="fechaCaducidad"
          value={formValues.fechaCaducidad}
          onChange={handleInputChange}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <label style={{ marginTop: "10px", marginBottom: "5px" }}>
          Fecha de Entrada
        </label>
        <input
          type="datetime-local"
          step="1"
          name="fechaEntrada"
          value={formValues.fechaEntrada}
          onChange={handleInputChange}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <label style={{ marginTop: "10px", marginBottom: "5px" }}>
          Cantidad
        </label>
        <input
          type="number"
          name="cantidad"
          value={formValues.cantidad}
          onChange={handleInputChange}
          required
          min="0"
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        {/* Mostrar inputs de números de serie si el producto los maneja */}
        {selectedProduct &&
          selectedProduct.HasNumSerie &&
          serialNumbers.length > 0 && (
            <div>
              <div>
                <label style={{ marginTop: "10px" }}>
                  Ingrese los números de serie:
                </label>
              </div>
              {serialNumbers.map((serial, index) => (
                <input
                  key={index}
                  type="text"
                  value={serial}
                  onChange={(e) => handleSerialNumberChange(e, index)}
                  placeholder={`Número de serie ${index + 1}`}
                  required
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    marginBottom: "5px",
                  }}
                />
              ))}
            </div>
          )}

        <label style={{ marginTop: "10px", marginBottom: "5px" }}>
          Descripción
        </label>
        <textarea
          name="notas"
          rows={5}
          placeholder="Notas"
          value={formValues.notas}
          onChange={handleInputChange}
          style={{
            resize: "none",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <button type="submit" className="button3">
          Enviar
        </button>
        <button onClick={regresar} style={{ marginTop: "20px" }}>
          Regresar
        </button>
      </form>
    </div>
  );
};
