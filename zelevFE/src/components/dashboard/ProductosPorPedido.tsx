import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import { PedidoGrafica } from '@/lib/types/types';
import { FC } from 'react';

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

interface ProductosPorPedidoProps {
  pedidos: PedidoGrafica[];
}

const ProductosPorPedidoChart: FC<ProductosPorPedidoProps> = ({ pedidos }) => {
  const data = {
    labels: pedidos.map(pedido => `Pedido ${pedido.idPedido}`),
    datasets: [
      {
        label: 'Cantidad de Productos',
        data: pedidos.map(pedido =>
          pedido.pediUnidList.reduce((total, item) => total + item.cantidad, 0)
        ),
        backgroundColor: '#3B82F6',
      },
    ],
  };

  return <Bar data={data} />;
};

export default ProductosPorPedidoChart;