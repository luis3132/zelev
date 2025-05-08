import { PedidoGrafica } from '@/lib/types/types';
import { FC } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar los elementos necesarios
ChartJS.register(ArcElement, Tooltip, Legend);

interface StatusChartprops {
    pedidos: PedidoGrafica[];
}

const StatusChart: FC<StatusChartprops> = ({ pedidos }) => {
  const data = {
    labels: ['PROCESO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'],
    datasets: [{
      data: [
        pedidos.filter(p => p.estado === 'PROCESO').length,
        pedidos.filter(p => p.estado === 'ENVIADO').length,
        pedidos.filter(p => p.estado === 'ENTREGADO').length,
        pedidos.filter(p => p.estado === 'CANCELADO').length
      ],
      backgroundColor: ['#F59E0B', '#3B82F6', '#10B981', '#EF4444']
    }]
  };

  return(
    <>
        <Doughnut data={data} />
    </>
  )
};

export default StatusChart;