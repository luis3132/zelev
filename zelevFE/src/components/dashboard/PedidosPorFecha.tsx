import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { PedidoGrafica } from '@/lib/types/types';
import { FC } from 'react';

ChartJS.register(LineElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement);

interface PedidosPorFechaChartprops {
    pedidos: PedidoGrafica[];
}

const PedidosPorFechaChart: FC<PedidosPorFechaChartprops> = ({ pedidos }) => {
  const fechas = pedidos.map(pedido => new Date(pedido.fechaPedido).toISOString().split('T')[0]);
  const fechasUnicas = [...new Set(fechas)];
  const data = {
    labels: fechasUnicas,
    datasets: [
      {
        label: 'Pedidos por Fecha',
        data: fechasUnicas.map(
          fecha => pedidos.filter(pedido => new Date(pedido.fechaPedido).toISOString().startsWith(fecha)).length
        ),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
      },
    ],
  };

  return <Line data={data} />;
};

export default PedidosPorFechaChart;