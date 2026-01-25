import { useEffect, useState } from 'react';
import { turnosAPI, vehiculosAPI, clientesAPI } from '../services/api';
import Layout from '../components/Layout/Layout';

const Turnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    cliente: '',
    vehiculo: '',
    fecha: '',
    hora: '',
    duracionMin: 60,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [turnosRes, clientesRes, vehiculosRes] = await Promise.all([
        turnosAPI.getAll(),
        clientesAPI.getAll(),
        vehiculosAPI.getAll(),
      ]);
      setTurnos(turnosRes.data);
      setClientes(clientesRes.data);
      setVehiculos(vehiculosRes.data.data || vehiculosRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fechaCompleta = new Date(`${formData.fecha}T${formData.hora}`);
      await turnosAPI.create({
        cliente: formData.cliente,
        vehiculo: formData.vehiculo,
        fecha: fechaCompleta.toISOString(),
        duracionMin: formData.duracionMin,
      });
      setShowModal(false);
      setFormData({ cliente: '', vehiculo: '', fecha: '', hora: '', duracionMin: 60 });
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al crear turno');
    }
  };

  const handleEstado = async (id, accion) => {
    try {
      await turnosAPI[accion](id);
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al cambiar estado');
    }
  };

  const getVehiculosByCliente = (clienteId) => {
    return vehiculos.filter(
      (v) => (v.cliente?._id || v.cliente) === clienteId
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Cargando turnos...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1>Turnos</h1>
          <button
            className="btn-primary"
            onClick={() => {
              setFormData({ cliente: '', vehiculo: '', fecha: '', hora: '', duracionMin: 60 });
              setShowModal(true);
            }}
          >
            + Nuevo Turno
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Fecha y Hora</th>
                <th>Duración</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {turnos.map((turno) => (
                <tr key={turno._id}>
                  <td>
                    {typeof turno.cliente === 'object'
                      ? turno.cliente.nombre
                      : 'N/A'}
                  </td>
                  <td>
                    {typeof turno.vehiculo === 'object'
                      ? `${turno.vehiculo.marca} ${turno.vehiculo.modelo} (${turno.vehiculo.patente})`
                      : 'N/A'}
                  </td>
                  <td>
                    {new Date(turno.fecha).toLocaleString('es-AR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td>{turno.duracionMin || 60} min</td>
                  <td>
                    <span className={`badge badge-${turno.estado}`}>
                      {turno.estado}
                    </span>
                  </td>
                  <td>
                    {turno.estado === 'pendiente' && (
                      <>
                        <button
                          className="btn-sm btn-success"
                          onClick={() => handleEstado(turno._id, 'aprobar')}
                        >
                          Aprobar
                        </button>
                        <button
                          className="btn-sm btn-danger"
                          onClick={() => handleEstado(turno._id, 'rechazar')}
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                    {(turno.estado === 'pendiente' || turno.estado === 'confirmado') && (
                      <button
                        className="btn-sm btn-warning"
                        onClick={() => handleEstado(turno._id, 'cancelar')}
                      >
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Nuevo Turno</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Cliente</label>
                  <select
                    value={formData.cliente}
                    onChange={(e) =>
                      setFormData({ ...formData, cliente: e.target.value, vehiculo: '' })
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
                  <label>Vehículo</label>
                  <select
                    value={formData.vehiculo}
                    onChange={(e) =>
                      setFormData({ ...formData, vehiculo: e.target.value })
                    }
                    required
                    disabled={!formData.cliente}
                  >
                    <option value="">Seleccionar vehículo</option>
                    {getVehiculosByCliente(formData.cliente).map((vehiculo) => (
                      <option key={vehiculo._id} value={vehiculo._id}>
                        {vehiculo.marca} {vehiculo.modelo} - {vehiculo.patente}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Fecha</label>
                  <input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Hora</label>
                  <input
                    type="time"
                    value={formData.hora}
                    onChange={(e) =>
                      setFormData({ ...formData, hora: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duración (minutos)</label>
                  <input
                    type="number"
                    value={formData.duracionMin}
                    onChange={(e) =>
                      setFormData({ ...formData, duracionMin: parseInt(e.target.value) })
                    }
                    min="30"
                    step="30"
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    Crear Turno
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

export default Turnos;

