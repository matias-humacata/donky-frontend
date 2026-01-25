import { useEffect, useState } from 'react';
import { clientesAPI } from '../services/api';
import Layout from '../components/Layout/Layout';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', telefono: '' });

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const response = await clientesAPI.getAll();
      setClientes(response.data);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await clientesAPI.update(editing._id, formData);
      } else {
        await clientesAPI.create(formData);
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ nombre: '', telefono: '' });
      loadClientes();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al guardar cliente');
    }
  };

  const handleEdit = (cliente) => {
    setEditing(cliente);
    setFormData({ nombre: cliente.nombre, telefono: cliente.telefono });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar este cliente?')) return;
    try {
      await clientesAPI.delete(id);
      loadClientes();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al eliminar cliente');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Cargando clientes...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1>Clientes</h1>
          <button
            className="btn-primary"
            onClick={() => {
              setEditing(null);
              setFormData({ nombre: '', telefono: '' });
              setShowModal(true);
            }}
          >
            + Nuevo Cliente
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente._id}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.telefono}</td>
                  <td>
                    <span className={`badge badge-${cliente.activo ? 'activo' : 'inactivo'}`}>
                      {cliente.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-sm btn-edit"
                      onClick={() => handleEdit(cliente)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-sm btn-delete"
                      onClick={() => handleDelete(cliente._id)}
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
              <h2>{editing ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                    required
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

export default Clientes;

