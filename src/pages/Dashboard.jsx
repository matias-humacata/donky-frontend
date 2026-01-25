import { useEffect, useState } from 'react';
import { metricasAPI, turnosAPI, clientesAPI, vehiculosAPI } from '../services/api';
import Layout from '../components/Layout/Layout';

const Dashboard = () => {
  const [metricas, setMetricas] = useState(null);
  const [turnosHoy, setTurnosHoy] = useState([]);
  const [stats, setStats] = useState({
    turnosPendientes: 0,
    turnosConfirmados: 0,
    clientesActivos: 0,
    vehiculosRegistrados: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricasRes, turnosRes, clientesRes, vehiculosRes] = await Promise.all([
          metricasAPI.get(),
          turnosAPI.getAll(),
          clientesAPI.getAll(),
          vehiculosAPI.getAll(),
        ]);

        const turnos = turnosRes.data;
        const clientes = clientesRes.data;
        const vehiculos = vehiculosRes.data.data || vehiculosRes.data;

        const turnosPendientes = turnos.filter((t) => t.estado === 'pendiente').length;
        const turnosConfirmados = turnos.filter((t) => t.estado === 'confirmado').length;
        const clientesActivos = clientes.filter((c) => c.activo !== false).length;

        setMetricas(metricasRes.data);
        setStats({
          turnosPendientes,
          turnosConfirmados,
          clientesActivos,
          vehiculosRegistrados: Array.isArray(vehiculos) ? vehiculos.length : 0,
        });
        setTurnosHoy(turnos.slice(0, 5));
      } catch (error) {
        console.error('Error cargando dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="loading">Cargando dashboard...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard">
        <h1>Dashboard</h1>

        <div className="metricas-grid">
          <div className="metrica-card">
            <h3>Turnos Pendientes</h3>
            <p className="metrica-valor">{stats.turnosPendientes}</p>
          </div>
          <div className="metrica-card">
            <h3>Turnos Confirmados</h3>
            <p className="metrica-valor">{stats.turnosConfirmados}</p>
          </div>
          <div className="metrica-card">
            <h3>Clientes Activos</h3>
            <p className="metrica-valor">{stats.clientesActivos}</p>
          </div>
          <div className="metrica-card">
            <h3>Vehículos Registrados</h3>
            <p className="metrica-valor">{stats.vehiculosRegistrados}</p>
          </div>
        </div>

        {metricas && (
          <div className="metricas-grid" style={{ marginTop: '1.5rem' }}>
            <div className="metrica-card">
              <h3>Total Turnos</h3>
              <p className="metrica-valor">{metricas.totalTurnos || 0}</p>
            </div>
            <div className="metrica-card">
              <h3>Cancelaciones</h3>
              <p className="metrica-valor">{metricas.cancelaciones?.total || 0}</p>
            </div>
            <div className="metrica-card">
              <h3>Tasa Cancelación</h3>
              <p className="metrica-valor">{metricas.tasaCancelacionPorcentaje || 0}%</p>
            </div>
          </div>
        )}

        <div className="turnos-hoy">
          <h2>Próximos Turnos</h2>
          {turnosHoy.length === 0 ? (
            <p>No hay turnos programados</p>
          ) : (
            <div className="turnos-list">
              {turnosHoy.map((turno) => (
                <div key={turno._id} className="turno-card">
                  <div>
                    <strong>
                      {turno.cliente?.nombre} - {turno.vehiculo?.patente}
                    </strong>
                    <p>
                      {new Date(turno.fecha).toLocaleString('es-AR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                  <span className={`badge badge-${turno.estado}`}>
                    {turno.estado}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

