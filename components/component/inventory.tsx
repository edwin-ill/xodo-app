"use client";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { EmblaCarousel } from "./EmblaCarousel";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';

type Dealership = {
  id: number;
  name: string;
  address: string;
  city: string;
  phoneNumber: string;
  email: string;
};

type VehicleImage = {
  id: number;
  vehicleId: number;
  imageUrl: string;
};

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
  dealership: Dealership;
  vehicleImages: VehicleImage[];
};

export function Inventory() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    minPrice: 0,
    maxPrice: 0,
    minYear: 0,
    maxYear: 0,
    minMileage: 0,
    maxMileage: 0,
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get<{ succeeded: boolean, message: string, errors: any, data: Car[] }>("https://localhost:7126/api/v1/Vehicle");
        if (response.data.succeeded && Array.isArray(response.data.data)) {
          setCars(response.data.data);
        } else {
          Swal.fire({
            title: 'Error al cargar los datos',
            text: response.data.message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
          setError("Error en el formato de los datos");
        }
      } catch (error) {
        Swal.fire({
          title: 'Error desconocido',
          text: 'Ocurrió un error al cargar los datos. Por favor, intente de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        setError(error instanceof Error ? error.message : "Ocurrió un error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const router = useRouter();

  const handleCarClick = (car) => {
    router.push(`/car/${car.id}`);
  };
  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      return (
        (filters.make === "" || car.carMake.toLowerCase().includes(filters.make.toLowerCase())) &&
        (filters.model === "" || car.model.toLowerCase().includes(filters.model.toLowerCase())) &&
        (filters.minPrice === 0 || car.price >= filters.minPrice) &&
        (filters.maxPrice === 0 || car.price <= filters.maxPrice) &&
        (filters.minYear === 0 || car.year >= filters.minYear) &&
        (filters.maxYear === 0 || car.year <= filters.maxYear) &&
        (filters.minMileage === 0 || car.mileage >= filters.minMileage) &&
        (filters.maxMileage === 0 || car.mileage <= filters.maxMileage)
      );
    });
  }, [filters, cars]);

  useEffect(() => {
    if (cars.length === 0 && !loading && !error) {
      Swal.fire({
        title: 'No hay inventario disponible',
        text: 'No se encontraron vehículos',
        icon: 'info',
        confirmButtonText: 'OK'
      });
    }
  }, [cars, loading, error]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">      
      <main className="flex flex-1 p-4 space-x-4">
        <aside className="w-1/4 p-4 bg-white border rounded-md">
          <h2 className="mb-4 text-lg font-semibold">Elige tu coche</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Marca</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Ingrese la marca"
                value={filters.make}
                onChange={(e) => handleFilterChange("make", e.target.value)}
              />
            </div>
            <div> 
              <label className="block mb-2 text-sm font-medium">Modelo</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Ingrese el modelo"
                value={filters.model}
                onChange={(e) => handleFilterChange("model", e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Precio</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  className="w-1/2 p-2 border rounded-md"
                  placeholder="Mín"
                  value={filters.minPrice || ""}
                  onChange={(e) => handleFilterChange("minPrice", Number(e.target.value))}
                />
                <input
                  type="number"
                  className="w-1/2 p-2 border rounded-md"
                  placeholder="Máx"
                  value={filters.maxPrice || ""}
                  onChange={(e) => handleFilterChange("maxPrice", Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Año</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  className="w-1/2 p-2 border rounded-md"
                  placeholder="Mín"
                  value={filters.minYear || ""}
                  onChange={(e) => handleFilterChange("minYear", Number(e.target.value))}
                />
                <input
                  type="number"
                  className="w-1/2 p-2 border rounded-md"
                  placeholder="Máx"
                  value={filters.maxYear || ""}
                  onChange={(e) => handleFilterChange("maxYear", Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Kilometraje</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  className="w-1/2 p-2 border rounded-md"
                  placeholder="Mín"
                  value={filters.minMileage || ""}
                  onChange={(e) => handleFilterChange("minMileage", Number(e.target.value))}
                />
                <input
                  type="number"
                  className="w-1/2 p-2 border rounded-md"
                  placeholder="Máx"
                  value={filters.maxMileage || ""}
                  onChange={(e) => handleFilterChange("maxMileage", Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </aside>
        <section className="flex-1 p-4 bg-white border rounded-md shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Coches disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
                <div 
                  key={car.id} 
                  className="p-4 bg-white border rounded-lg shadow-lg transition duration-300 ease-in-out hover:shadow-xl overflow-hidden cursor-pointer" 
                  onClick={() => handleCarClick(car)}
                >
                <div className="w-full h-48 mb-4">
                  <EmblaCarousel
                    vehicleImages={car.vehicleImages}
                    options={{ loop: true }}
                  />
                </div>
                <h4 className="mb-2 text-sm font-medium text-gray-600">{car.status?.toUpperCase() || "USADO"}</h4>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">{car.carMake} {car.model}</h3>
                <p className="mb-2 text-sm text-gray-600 line-clamp-2">{car.description}</p>
                <p className="mb-4 text-xl font-bold text-gray-900">DOP$ {car.price.toLocaleString()}</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <div>
                    <p className="font-medium">Combustible</p>
                    <p>{car.engineType}</p>
                  </div>
                  <div>
                    <p className="font-medium">Transmisión</p>
                    <p>{car.transmissionType}</p>
                  </div>
                  <div>
                    <p className="font-medium">Año</p>
                    <p>{car.year}</p>
                  </div>
                  <div>
                    <p className="font-medium">Kilometraje</p>
                    <p>{car.mileage} km</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
