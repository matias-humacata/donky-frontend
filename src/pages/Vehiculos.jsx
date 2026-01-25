import { useEffect, useState } from 'react';
import { vehiculosAPI, clientesAPI } from '../services/api';
import Layout from '../components/Layout/Layout';

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    cliente: '',
    marca: '',
    modelo: '',
    patente: '',
    anio: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [vehiculosRes, clientesRes] = await Promise.all([
        vehiculosAPI.getAll(),
        clientesAPI.getAll(),
      ]);
      setVehiculos(vehiculosRes.data.data || vehiculosRes.data);
      setClientes(clientesRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await vehiculosAPI.update(editing._id, formData);
      } else {
        await vehiculosAPI.create(formData);
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ cliente: '', marca: '', modelo: '', patente: '', anio: '' });
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al guardar vehículo');
    }
  };

  const handleEdit = (vehiculo) => {
    setEditing(vehiculo);
    setFormData({
      cliente: vehiculo.cliente._id || vehiculo.cliente,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      patente: vehiculo.patente,
      anio: vehiculo.anio || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar este vehículo?')) return;
    try {
      await vehiculosAPI.delete(id);
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al eliminar vehículo');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Cargando vehículos...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1>Vehículos</h1>
          <button
            className="btn-primary"
            onClick={() => {
              setEditing(null);
              setFormData({ cliente: '', marca: '', modelo: '', patente: '', anio: '' });
              setShowModal(true);
            }}
          >
            + Nuevo Vehículo
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Patente</th>
                <th>Año</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.map((vehiculo) => (
                <tr key={vehiculo._id}>
                  <td>
                    {typeof vehiculo.cliente === 'object'
                      ? vehiculo.cliente.nombre
                      : 'N/A'}
                  </td>
                  <td>{vehiculo.marca}</td>
                  <td>{vehiculo.modelo}</td>
                  <td>{vehiculo.patente}</td>
                  <td>{vehiculo.anio || '-'}</td>
                  <td>
                    <button
                      className="btn-sm btn-edit"
                      onClick={() => handleEdit(vehiculo)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-sm btn-delete"
                      onClick={() => handleDelete(vehiculo._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editing ? 'Editar Vehículo' : 'Nuevo Vehículo'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Cliente</label>
                  <select
                    value={formData.cliente}
                    onChange={(e) =>
                      setFormData({ ...formData, cliente: e.target.value })
                    }
                    required
                  >
                    <option value="">Seleccionar cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente._id} value={cliente._id}>
                        {cliente.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Marca</label>
                  <input
                    type="text"
                    value={formData.marca}
                    onChange={(e) =>
                      setFormData({ ...formData, marca: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Modelo</label>
                  <input
                    type="text"
                    value={formData.modelo}
                    onChange={(e) =>
                      setFormData({ ...formData, modelo: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Patente</label>
                  <input
                    type="text"
                    value={formData.patente}
                    onChange={(e) =>
                      setFormData({ ...formData, patente: e.target.value.toUpperCase() })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Año</label>
                  <input
                    type="number"
                    value={formData.anio}
                    onChange={(e) =>
                      setFormData({ ...formData, anio: e.target.value })
                    }
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {editing ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Vehiculos;

