import { useEffect, useState } from 'react';
import { tallerAPI } from '../services/api';
import Layout from '../components/Layout/Layout';

const Configuracion = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await tallerAPI.get();
      setConfig(response.data);
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await tallerAPI.update(config);
      alert('Configuración guardada exitosamente');
    } catch (error) {
      alert(error.response?.data?.error || 'Error al guardar configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Cargando configuración...</div>
      </Layout>
    );
  }

  if (!config) {
    return (
      <Layout>
        <div>No se pudo cargar la configuración</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <h1>Configuración del Taller</h1>
        <form onSubmit={handleSubmit} className="config-form">
          <div className="form-group">
            <label>Horario de Apertura</label>
            <input
              type="time"
              value={config.horarioApertura || ''}
              onChange={(e) =>
                setConfig({ ...config, horarioApertura: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Horario de Cierre</label>
            <input
              type="time"
              value={config.horarioCierre || ''}
              onChange={(e) =>
                setConfig({ ...config, horarioCierre: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Días Laborales (separados por comas)</label>
            <input
              type="text"
              value={config.diasLaborales?.join(', ') || ''}
              onChange={(e) =>
                setConfig({
                  ...config,
                  diasLaborales: e.target.value.split(',').map((d) => d.trim()),
                })
              }
              placeholder="lunes, martes, miercoles, jueves, viernes"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Configuracion;

