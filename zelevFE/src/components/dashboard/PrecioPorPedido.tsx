import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { PedidoGrafica } from '@/lib/types/types';
import { FC } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PreciosPorPedidoChartProps {
  pedidos: PedidoGrafica[];
}

const PreciosPorPedidoChart: FC<PreciosPorPedidoChartProps> = ({ pedidos }) => {
  const data = {
    labels: pedidos.map(pedido => `Pedido ${pedido.idPedido}`),
    datasets: [
      {
        label: 'Precio Total por Pedido',
        data: pedidos.map(pedido =>
          pedido.pediUnidList.reduce(
            (total, item) => total + parseFloat(item.precio) * item.cantidad,
            0
          )
        ),
        backgroundColor: ['#F59E0B', '#3B82F6', '#10B981', '#EF4444', '#8B4513'],
      },
    ],
  };

  return <Line data={data} />;
};

export default PreciosPorPedidoChart;