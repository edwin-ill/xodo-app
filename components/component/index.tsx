"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmblaCarousel } from "./EmblaCarousel";
import { useRouter } from "next/navigation";

type Car = {
  id: number;
  vin: string;
  carMake: string;
  model: string;
  year: number;
  color: string;
  price: number;
  engineType: string;
  status: string | null;
  transmissionType: string;
  mileage: number;
  description: string;
  dealershipId: number;
  vehicleType: string;
  vehicleImages: { id: number; vehicleId: number; imageUrl: string }[];
};

export default function Component() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get<{ succeeded: boolean; message: string; errors: any; data: Car[] }>("https://localhost:7126/api/v1/Vehicle");
        if (response.data.succeeded && Array.isArray(response.data.data)) {
          setCars(response.data.data.slice(0, 4)); 
        } else {
          throw new Error("Data format error");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleCarClick = (car: Car) => {
    router.push(`/car/${car.id}`);
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="relative h-[60vh] md:h-[80vh]">
          <img
            src="https://espaillatmotors.com/wp-content/uploads/2023/05/1-18-scaled.jpg"
            alt="Hero Image"
            width={1920}
            height={1080}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
            <div className="text-center text-white space-y-6">
              <div className="flex items-center justify-center">
                <CarIcon className="h-12 w-12 mr-2" />
                <h1 className="text-4xl md:text-6xl font-bold">Acme Dealership</h1>
              </div>
              <p className="text-lg md:text-xl">Descubre tu carro de ensueños.</p>
              <Button className="w-1/2 bg-red-600 hover:bg-red-700 text-white" onClick={() => router.push('/inventory')}>Navegar inventario</Button>
            </div>
          </div>
        </section>
        <section className="bg-gray-100 py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Nuestro inventario actual</h2>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {cars.map((car) => (
                  <Card key={car.id} className="cursor-pointer" onClick={() => handleCarClick(car)}>
                    <div className="w-full h-48">
                      <EmblaCarousel
                        vehicleImages={car.vehicleImages}
                        options={{ loop: true }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="mb-2 text-sm font-medium text-gray-600">{car.status?.toUpperCase() || "USADO"}</h4>
                      <h3 className="text-lg font-bold">{car.carMake} {car.model}</h3>
                      <p className="text-gray-500 text-sm">{car.year} | DOP$ {car.price.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <footer className="bg-gray-950 text-white py-6 px-4 md:px-6">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm">&copy; 2024 Acme Dealership. Todos los derechos reservados.</p>
          <nav className="flex items-center space-x-4">
            <Link href="#" className="hover:underline" prefetch={false}>
              Políticas de privacidad
            </Link>
            <Link href="#" className="hover:underline" prefetch={false}>
              Terminos de servicio
            </Link>
            <Link href="#" className="hover:underline" prefetch={false}>
              Contactanos
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function CarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}