"use client";
import { Carindex2 } from '@/components/component/car-index2';
import { useParams } from 'next/navigation';

export default function CarDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  if (!id) {
    return <div>Loading...</div>;
  }
  const carId = parseInt(id, 10);

  if (isNaN(carId)) {
    return <div>Invalid car ID</div>;
  }

  return <Carindex2 id={carId} />;
}